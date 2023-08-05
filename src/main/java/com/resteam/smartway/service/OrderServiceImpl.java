package com.resteam.smartway.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.resteam.smartway.domain.DiningTable;
import com.resteam.smartway.domain.MenuItem;
import com.resteam.smartway.domain.order.OrderDetail;
import com.resteam.smartway.domain.order.SwOrder;
import com.resteam.smartway.domain.order.notifications.ItemAdditionNotification;
import com.resteam.smartway.domain.order.notifications.KitchenNotificationHistory;
import com.resteam.smartway.repository.DiningTableRepository;
import com.resteam.smartway.repository.MenuItemRepository;
import com.resteam.smartway.repository.order.ItemAdditionNotificationRepository;
import com.resteam.smartway.repository.order.OrderDetailRepository;
import com.resteam.smartway.repository.order.OrderRepository;
import com.resteam.smartway.service.dto.DiningTableDTO;
import com.resteam.smartway.service.dto.order.*;
import com.resteam.smartway.service.dto.order.notification.ItemAdditionNotificationDTO;
import com.resteam.smartway.service.dto.order.notification.OrderDetailPriorityDTO;
import com.resteam.smartway.service.mapper.order.OrderMapper;
import com.resteam.smartway.service.mapper.order.notification.ItemAdditionNotificationMapper;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final DiningTableRepository diningTableRepository;
    private final MenuItemRepository menuItemRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final ItemAdditionNotificationRepository itemAdditionNotificationRepository;
    private final ItemAdditionNotificationMapper itemAdditionNotificationMapper;

    private static final String ORDER = "order";
    private static final String TABLE = "table";
    private static final String MENUITEM = "menuItem";
    private static final String ORDER_DETAIL = "orderDetail";

    @Override
    public OrderDTO createOrder(OrderCreationDTO orderDTO) {
        List<DiningTable> tableList = orderDTO
            .getTableIdList()
            .stream()
            .map(id ->
                diningTableRepository
                    .findByIdAndIsFreeAndIsActive(id, true, true)
                    .orElseThrow(() -> new BadRequestAlertException("Table was not found or not free", TABLE, "notFreeOrNotExisted"))
            )
            .collect(Collectors.toList());

        MenuItem menuItem = menuItemRepository
            .findByIdAndIsActiveAndIsInStock(orderDTO.getMenuItemId(), true, true)
            .orElseThrow(() -> new BadRequestAlertException("Menu item was not found", MENUITEM, "idnotfound"));

        SwOrder order = new SwOrder();
        String orderCode = generateCode();
        order.setCode(orderCode);
        order.setPaid(false);
        order.setTableList(tableList);

        OrderDetail orderDetail = new OrderDetail();
        orderDetail.setMenuItem(menuItem);
        orderDetail.setOrder(order);
        orderDetail.setQuantity(1);
        orderDetail.setUnnotifiedQuantity(1);

        order.setOrderDetailList(List.of(orderDetail));

        SwOrder savedOrder = orderRepository.save(order);
        orderDetailRepository.save(orderDetail);

        diningTableRepository.saveAll(tableList.stream().peek(table -> table.setIsFree(false)).collect(Collectors.toList()));

        return orderMapper.toDto(savedOrder);
    }

    private SwOrder sortOrderDetailsAndNotificationHistories(SwOrder order) {
        List<OrderDetail> orderDetails = order.getOrderDetailList();
        orderDetails.sort((o1, o2) -> {
            if (o1.equals(o2)) return 1; else return -1;
        });
        order.setOrderDetailList(orderDetails);

        List<KitchenNotificationHistory> kitchenNotificationHistoryList = order.getKitchenNotificationHistoryList();
        kitchenNotificationHistoryList.sort((o1, o2) -> {
            if (o1.equals(o2)) return 1; else return -1;
        });
        order.setKitchenNotificationHistoryList(kitchenNotificationHistoryList);

        return order;
    }

    private String generateCode() {
        Optional<SwOrder> lastOrder = orderRepository.findTopByOrderByCodeDesc();
        if (lastOrder.isEmpty()) return "OD000001"; else {
            String lastCode = lastOrder.get().getCode();
            int nextCodeInt = Integer.parseInt(lastCode.substring(2)) + 1;
            if (nextCodeInt > 999999) throw new IllegalStateException("Maximum Code reached");
            return String.format("OD%06d", nextCodeInt);
        }
    }

    @Override
    public OrderDTO adjustDetailQuantity(OrderDetailAdjustQuantityDTO dto) {
        OrderDetail orderDetail = orderDetailRepository
            .findById(dto.getOrderDetailId())
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ORDER_DETAIL, "idnotfound"));
        if (orderDetail.getOrder().isPaid()) throw new BadRequestAlertException(
            "Order detail you want to adjust is in a paid order",
            ORDER,
            "paidOrder"
        );

        if (!orderDetail.getMenuItem().getIsInStock()) throw new BadRequestAlertException("Item is out of stock", MENUITEM, "notInStock");

        orderDetail.setQuantity(orderDetail.getQuantity() + dto.getQuantityAdjust());
        orderDetail.setUnnotifiedQuantity(orderDetail.getUnnotifiedQuantity() + dto.getQuantityAdjust());

        if (orderDetail.getQuantity() < 1 || orderDetail.getUnnotifiedQuantity() < 0) throw new BadRequestAlertException(
            "Cannot decrease item quantity more",
            ORDER_DETAIL,
            "cannotAdjust"
        );

        orderDetailRepository.saveAndFlush(orderDetail);
        return orderMapper.toDto(sortOrderDetailsAndNotificationHistories(orderDetail.getOrder()));
    }

    @Override
    public OrderDTO addNoteToOrderDetail(DetailAddNoteDTO dto) {
        OrderDetail orderDetail = orderDetailRepository
            .findById(dto.getOrderDetailId())
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ORDER_DETAIL, "idnotfound"));
        if (orderDetail.getOrder().isPaid()) throw new BadRequestAlertException(
            "Order detail you want to adjust is in a paid order",
            ORDER,
            "paidOrder"
        );
        if (!(orderDetail.getUnnotifiedQuantity() == orderDetail.getQuantity())) {
            throw new BadRequestAlertException("Cannot add note to this order", ORDER_DETAIL, "Cannotaddnote");
        }
        orderDetail.setNote(dto.getNote());
        orderDetailRepository.saveAndFlush(orderDetail);
        return orderMapper.toDto(sortOrderDetailsAndNotificationHistories(orderDetail.getOrder()));
    }

    @Override
    public OrderDTO addOrderDetail(OrderDetailAdditionDTO orderDetailDTO) {
        SwOrder order = orderRepository
            .findByIdAndIsPaid(orderDetailDTO.getOrderId(), false)
            .orElseThrow(() -> new BadRequestAlertException("Order was not found or paid", ORDER, "idnotfound"));
        MenuItem menuItem = menuItemRepository
            .findByIdAndIsActiveAndIsInStock(orderDetailDTO.getMenuItem().getId(), true, true)
            .orElseThrow(() -> new BadRequestAlertException("Menu item was not found or not in stock", MENUITEM, "idnotfound"));

        OrderDetail orderDetail = new OrderDetail();
        orderDetail.setOrder(order);
        orderDetail.setMenuItem(menuItem);
        orderDetail.setQuantity(orderDetailDTO.getQuantity());
        orderDetail.setUnnotifiedQuantity(orderDetail.getQuantity());

        OrderDetail savedOrderDetail = orderDetailRepository.saveAndFlush(orderDetail);
        return orderMapper.toDto(sortOrderDetailsAndNotificationHistories(savedOrderDetail.getOrder()));
    }

    @Override
    public OrderDTO notifyKitchen(UUID orderId) {
        SwOrder order = orderRepository
            .findByIdAndIsPaid(orderId, false)
            .orElseThrow(() -> new BadRequestAlertException("Order was not found or paid", TABLE, "idnotfound"));

        KitchenNotificationHistory kitchenNotificationHistory = new KitchenNotificationHistory();
        kitchenNotificationHistory.setOrder(order);

        List<ItemAdditionNotification> itemAdditionNotificationList = new ArrayList<>();
        List<OrderDetail> orderDetails = order
            .getOrderDetailList()
            .stream()
            .peek(detail -> {
                if (detail.getUnnotifiedQuantity() > 0) {
                    ItemAdditionNotification notification = new ItemAdditionNotification();
                    notification.setKitchenNotificationHistory(kitchenNotificationHistory);
                    notification.setNote(detail.getNote());
                    notification.setOrderDetail(detail);
                    notification.setPriority(detail.isPriority());
                    notification.setQuantity(detail.getUnnotifiedQuantity());
                    notification.setCompleted(false);

                    itemAdditionNotificationList.add(notification);

                    detail.setUnnotifiedQuantity(0);
                }
            })
            .collect(Collectors.toList());

        kitchenNotificationHistory.setItemAdditionNotificationList(itemAdditionNotificationList);
        List<KitchenNotificationHistory> kitchenNotificationHistoryList = order.getKitchenNotificationHistoryList();
        kitchenNotificationHistoryList.add(kitchenNotificationHistory);
        SwOrder savedOrder = orderRepository.saveAndFlush(order);

        return orderMapper.toDto(sortOrderDetailsAndNotificationHistories(savedOrder));
    }

    @Override
    public List<OrderDTO> getAllActiveOrders() {
        List<SwOrder> orders = orderRepository
            .findByIsPaidFalse()
            .stream()
            .peek(order -> {
                List<OrderDetail> orderDetails = order.getOrderDetailList();
                orderDetails.sort((o1, o2) -> {
                    if (o1.equals(o2)) return 1; else return -1;
                });
                order.setOrderDetailList(orderDetails);
            })
            .collect(Collectors.toList());
        return orderMapper.toDto(orders);
    }

    @Override
    public OrderDTO findById(UUID id) {
        SwOrder order = orderRepository.findById(id).orElseThrow(() -> new BadRequestAlertException("Invalid ID", ORDER, "idnotfound"));
        return orderMapper.toDto(order);
    }

    //    @Override
    //    public void deleteMenuItem(List<String> ids) {
    //        List<MenuItem> menuItemIdList = ids
    //            .stream()
    //            .map(id -> {
    //                if (id == null) throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
    //                return menuItemRepository
    //                    .findById(UUID.fromString(id))
    //                    .orElseThrow(() -> new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idnotfound"));
    //            })
    //            .collect(Collectors.toList());
    //        menuItemRepository.deleteAll(menuItemIdList);
    //    }

    @Override
    public OrderDTO deleteOrderDetail(UUID orderDetailId) {
        OrderDetail orderDetail = orderDetailRepository
            .findById(orderDetailId)
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ORDER_DETAIL, "idnotfound"));
        if (orderDetail.getQuantity() != orderDetail.getUnnotifiedQuantity()) throw new BadRequestAlertException(
            "Cannot delete order detail",
            ORDER,
            "cantdelete"
        );

        SwOrder order = orderDetail.getOrder();
        if (order.isPaid()) throw new BadRequestAlertException("Order detail you want to adjust is in a paid order", ORDER, "paidOrder");

        order.getOrderDetailList().removeIf(detail -> detail.getId().equals(orderDetail.getId()));

        return orderMapper.toDto(sortOrderDetailsAndNotificationHistories(order));
    }

    @Override
    public List<ItemAdditionNotificationDTO> getAllOrderItemInKitchen() {
        return itemAdditionNotificationMapper.toDto(itemAdditionNotificationRepository.findByIsCompleted(false));
    }

    public OrderDTO changePriority(OrderDetailPriorityDTO orderDetailDTO) {
        UUID orderDetailId = orderDetailDTO.getOrderDetailId();
        OrderDetail orderDetail = orderDetailRepository
            .findById(orderDetailId)
            .orElseThrow(() -> new BadRequestAlertException("Order detail was not found", ORDER_DETAIL, "idnotfound"));
        orderDetail.setPriority(true);
        orderDetailRepository.save(orderDetail);
        SwOrder order = orderDetail.getOrder();

        return orderMapper.toDto(order);
    }

    @Override
    public void ungroupTables(UUID orderId, List<String> tableIds) {
        SwOrder order = orderRepository
            .findByIdAndIsPaid(orderId, false)
            .orElseThrow(() -> new BadRequestAlertException("Order was not found or paid", ORDER, "idnotfound"));

        List<DiningTable> tables = tableIds
            .stream()
            .map(id -> {
                if (id == null) throw new BadRequestAlertException("Invalid id", TABLE, "idnull");
                DiningTable table = diningTableRepository
                    .findByIdAndIsFreeAndIsActive(UUID.fromString(id), false, true)
                    .orElseThrow(() -> new BadRequestAlertException("Invalid ID", TABLE, "idnotfound"));
                table.setIsFree(true);
                return table;
            })
            .collect(Collectors.toList());

        for (DiningTable table : tables) {
            table.setIsFree(true);
            order.getTableList().remove(table);
        }

        orderRepository.save(order);
    }

    @Override
    public void groupTables(OrderDTO orderDTO, List<String> ids) {
        SwOrder order = orderRepository
            .findByIdAndIsPaid(orderDTO.getId(), false)
            .orElseThrow(() -> new BadRequestAlertException("Order was not found or paid", ORDER, "idnotfound"));
        List<DiningTable> tables = ids
            .stream()
            .map(id -> {
                if (id == null) throw new BadRequestAlertException("Invalid id", TABLE, "idnull");
                DiningTable table = diningTableRepository
                    .findByIdAndIsFreeAndIsActive(UUID.fromString(id), true, true)
                    .orElseThrow(() -> new BadRequestAlertException("Invalid ID", TABLE, "idnotfound"));
                table.setIsFree(false);
                return table;
            })
            .collect(Collectors.toList());
        order.setTableList(tables);
    }

    //    @Override
    //    public List<ItemAdditionNotification> getAllOrderItemInKitchen(){
    //        kitchenNotificationHistoryRepository
    //    }

    @Override
    public byte[] generatePdfOrder(OrderDTO orderDTO) throws DocumentException {
        Document document = new Document(PageSize.A7, 12, 12, 12, 12);

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, byteArrayOutputStream);

        // Customize PDF styles
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, BaseColor.BLACK);
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, BaseColor.DARK_GRAY);
        Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 8, BaseColor.GRAY);

        document.open();

        // Add a title to the document
        Paragraph nameRestaurant = new Paragraph("SmartWay", titleFont);
        Paragraph address = new Paragraph("Address: FPT University", titleFont);
        Paragraph phone = new Paragraph("Phone: 0888666789", titleFont);
        Paragraph line = new Paragraph("----------------", titleFont);
        Instant createdDateInstant = orderDTO.getCreatedDate();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss").withZone(ZoneId.systemDefault());
        String formattedDate = formatter.format(createdDateInstant);
        Paragraph timeIn = new Paragraph("Time In:  " + formattedDate, headerFont);
        Paragraph timeOut = new Paragraph("Time Out: " + getCurrentTime(), headerFont);
        List<DiningTableDTO> tableDTOs = orderDTO.getTableList();
        List<String> tableNames = new ArrayList<>();
        for (DiningTableDTO tableDTO : tableDTOs) {
            tableNames.add(tableDTO.getName());
        }
        Paragraph tableName = new Paragraph("Tables: " + String.join(", ", tableNames), headerFont);
        //        Paragraph staff = new Paragraph("Staff: "+ orderDTO.get, headerFont);
        Paragraph code = new Paragraph("Order Code: " + orderDTO.getCode(), headerFont);
        nameRestaurant.setAlignment(Element.ALIGN_CENTER);
        address.setAlignment(Element.ALIGN_CENTER);
        phone.setAlignment(Element.ALIGN_CENTER);
        line.setAlignment(Element.ALIGN_CENTER);
        timeIn.setAlignment(Element.ALIGN_LEFT);
        timeOut.setAlignment(Element.ALIGN_LEFT);
        //        staff.setAlignment(Element.ALIGN_LEFT);
        tableName.setAlignment(Element.ALIGN_LEFT);
        code.setAlignment(Element.ALIGN_LEFT);
        document.add(nameRestaurant);
        document.add(address);
        document.add(phone);
        document.add(line);
        document.add(timeIn);
        document.add(timeOut);
        //        document.add(staff);
        document.add(tableName);
        document.add(code);
        document.add(Chunk.NEWLINE); // Add some space between title and table content

        // Add table content with headers and values in separate rows
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);

        // Header row with relative widths
        float[] columnWidths = { 15f, 40f, 20f, 20f }; // Adjust the percentages here
        table.setWidths(columnWidths);
        // Header row
        addHeaderWithStyle(table, "STT", headerFont);
        addHeaderWithStyle(table, "Menu Item", headerFont);
        addHeaderWithStyle(table, "Quantity", headerFont);
        addHeaderWithStyle(table, "SellPrice", headerFont);

        // Data row
        List<OrderDetailDTO> orderDetailList = orderDTO.getOrderDetailList();
        int stt = 1;
        double sumMoney = 0.0;
        for (OrderDetailDTO orderDetail : orderDetailList) {
            addValueWithStyle(table, String.valueOf(stt), normalFont);
            addValueWithStyle(table, orderDetail.getMenuItem().getName(), normalFont);
            addValueWithStyle(table, String.valueOf(orderDetail.getQuantity()), normalFont);
            addValueWithStyle(table, String.valueOf(orderDetail.getMenuItem().getSellPrice()), normalFont);
            stt++;
            sumMoney += orderDetail.getQuantity() * orderDetail.getMenuItem().getSellPrice();
        }

        document.add(table);

        float spacingAfterTable = 10f; // Adjust the spacing as needed (in points)
        table.setSpacingAfter(spacingAfterTable);

        Paragraph subTotal = new Paragraph("Sub Total: " + sumMoney + "$", headerFont);
        subTotal.setAlignment(Element.ALIGN_LEFT);
        document.add(subTotal);
        Paragraph total = new Paragraph("Total:     " + sumMoney + "$", headerFont);
        total.setAlignment(Element.ALIGN_LEFT);
        document.add(total);

        document.add(line);

        String imageUrl = "https://static.vecteezy.com/system/resources/previews/002/557/391/original/qr-code-for-scanning-free-vector.jpg";
        try {
            // Add an image from an online URL to the document
            Image logo = Image.getInstance(new URL(imageUrl));
            logo.scaleToFit(75f, 75f);
            logo.setAlignment(Element.ALIGN_CENTER);
            document.add(logo);

            float spacingBeforeImage = 0f; // Adjust the spacing as needed (in points)
            float spacingAfterImage = 0f; // Adjust the spacing as needed (in points)
            logo.setSpacingBefore(spacingBeforeImage);
            logo.setSpacingAfter(spacingAfterImage);

            Paragraph poweredBy = new Paragraph("Powered By SmartWay.website", titleFont);
            poweredBy.setAlignment(Element.ALIGN_CENTER);
            document.add(poweredBy);
        } catch (MalformedURLException e) {
            System.err.println("MalformedURLException: Invalid URL format. Please check the URL.");
            e.printStackTrace();
        } catch (IOException e) {
            System.err.println("IOException: There was an error fetching the image from the provided URL.");
            e.printStackTrace();
        } catch (BadElementException e) {
            // Handle BadElementException
            System.err.println("BadElementException: Error while adding the image to the PDF.");
            e.printStackTrace();
            // Return or throw an appropriate error message or perform error handling as needed.
        }

        document.close();

        return byteArrayOutputStream.toByteArray();
    }

    @Override
    public byte[] generatePdfOrderForPay(OrderDTO orderDTO) throws DocumentException {
        Document document = new Document(PageSize.A7, 12, 12, 12, 12);

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, byteArrayOutputStream);

        // Customize PDF styles
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, BaseColor.BLACK);
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, BaseColor.DARK_GRAY);
        Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 8, BaseColor.GRAY);

        document.open();

        // Add a title to the document
        Paragraph nameRestaurant = new Paragraph("SmartWay", titleFont);
        Paragraph address = new Paragraph("Address: FPT University", titleFont);
        Paragraph phone = new Paragraph("Phone: 0888666789", titleFont);
        Paragraph line = new Paragraph("----------------", titleFont);
        Instant createdDateInstant = orderDTO.getCreatedDate();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss").withZone(ZoneId.systemDefault());
        String formattedDate = formatter.format(createdDateInstant);
        Paragraph timeIn = new Paragraph("Time In:  " + formattedDate, headerFont);
        Paragraph timeOut = new Paragraph("Time Out: " + getCurrentTime(), headerFont);
        List<DiningTableDTO> tableDTOs = orderDTO.getTableList();
        List<String> tableNames = new ArrayList<>();
        for (DiningTableDTO tableDTO : tableDTOs) {
            tableNames.add(tableDTO.getName());
        }
        Paragraph tableName = new Paragraph("Table: " + String.join(", ", tableNames), headerFont);
        //        Paragraph staff = new Paragraph("Staff: "+ orderDTO.get, headerFont);
        Paragraph code = new Paragraph("Order Code: " + orderDTO.getCode(), headerFont);
        nameRestaurant.setAlignment(Element.ALIGN_CENTER);
        address.setAlignment(Element.ALIGN_CENTER);
        phone.setAlignment(Element.ALIGN_CENTER);
        line.setAlignment(Element.ALIGN_CENTER);
        timeIn.setAlignment(Element.ALIGN_LEFT);
        timeOut.setAlignment(Element.ALIGN_LEFT);
        //        staff.setAlignment(Element.ALIGN_LEFT);
        tableName.setAlignment(Element.ALIGN_LEFT);
        code.setAlignment(Element.ALIGN_LEFT);
        document.add(nameRestaurant);
        document.add(address);
        document.add(phone);
        document.add(line);
        document.add(timeIn);
        document.add(timeOut);
        //        document.add(staff);
        document.add(tableName);
        document.add(code);
        document.add(Chunk.NEWLINE); // Add some space between title and table content

        // Add table content with headers and values in separate rows
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);

        // Header row with relative widths
        float[] columnWidths = { 15f, 40f, 20f, 20f }; // Adjust the percentages here
        table.setWidths(columnWidths);
        // Header row
        addHeaderWithStyle(table, "STT", headerFont);
        addHeaderWithStyle(table, "Menu Item", headerFont);
        addHeaderWithStyle(table, "Quantity", headerFont);
        addHeaderWithStyle(table, "SellPrice", headerFont);

        // Data row
        List<OrderDetailDTO> orderDetailList = orderDTO.getOrderDetailList();
        int stt = 1;
        double sumMoney = 0.0;
        for (OrderDetailDTO orderDetail : orderDetailList) {
            addValueWithStyle(table, String.valueOf(stt), normalFont);
            addValueWithStyle(table, orderDetail.getMenuItem().getName(), normalFont);
            addValueWithStyle(table, String.valueOf(orderDetail.getQuantity()), normalFont);
            addValueWithStyle(table, String.valueOf(orderDetail.getMenuItem().getSellPrice()), normalFont);
            stt++;
            sumMoney += orderDetail.getQuantity() * orderDetail.getMenuItem().getSellPrice();
        }

        document.add(table);

        float spacingAfterTable = 10f; // Adjust the spacing as needed (in points)
        table.setSpacingAfter(spacingAfterTable);

        Paragraph subTotal = new Paragraph("Sub Total: " + sumMoney + "$", headerFont);
        subTotal.setAlignment(Element.ALIGN_LEFT);
        document.add(subTotal);
        Paragraph total = new Paragraph("Total:     " + sumMoney + "$", headerFont);
        total.setAlignment(Element.ALIGN_LEFT);
        document.add(total);

        document.add(line);

        String imageUrl = "https://static.vecteezy.com/system/resources/previews/002/557/391/original/qr-code-for-scanning-free-vector.jpg";
        try {
            // Add an image from an online URL to the document
            Image logo = Image.getInstance(new URL(imageUrl));
            logo.scaleToFit(75f, 75f);
            logo.setAlignment(Element.ALIGN_CENTER);
            document.add(logo);

            float spacingBeforeImage = 0f; // Adjust the spacing as needed (in points)
            float spacingAfterImage = 0f; // Adjust the spacing as needed (in points)
            logo.setSpacingBefore(spacingBeforeImage);
            logo.setSpacingAfter(spacingAfterImage);

            Paragraph poweredBy = new Paragraph("Powered By SmartWay.website", titleFont);
            poweredBy.setAlignment(Element.ALIGN_CENTER);
            document.add(poweredBy);
        } catch (MalformedURLException e) {
            System.err.println("MalformedURLException: Invalid URL format. Please check the URL.");
            e.printStackTrace();
        } catch (IOException e) {
            System.err.println("IOException: There was an error fetching the image from the provided URL.");
            e.printStackTrace();
        } catch (BadElementException e) {
            // Handle BadElementException
            System.err.println("BadElementException: Error while adding the image to the PDF.");
            e.printStackTrace();
            // Return or throw an appropriate error message or perform error handling as needed.
        }
        Optional<SwOrder> swOrderOptional = orderRepository.findById(orderDTO.getId());
        if (swOrderOptional.isPresent()) {
            SwOrder swOrder = swOrderOptional.get();
            swOrder.setPaid(true);
            Instant payDate = Instant.now();
            swOrder.setPayDate(payDate);
            orderRepository.save(swOrder);
        }

        document.close();

        return byteArrayOutputStream.toByteArray();
    }

    private static void addHeaderWithStyle(PdfPTable table, String text, Font font) {
        PdfPCell headerCell = new PdfPCell(new Phrase(text, font));
        headerCell.setBorder(Rectangle.BOTTOM); // Show only the bottom border
        headerCell.setBorderColorBottom(BaseColor.DARK_GRAY);
        headerCell.setBorderWidthBottom(1f); // Set the thickness of the bottom border
        headerCell.setBorderWidthLeft(0f); // Remove left border
        headerCell.setBorderWidthRight(0f); // Remove right border
        headerCell.setHorizontalAlignment(Element.ALIGN_LEFT);
        headerCell.setPaddingBottom(5f);
        table.addCell(headerCell);
    }

    private static void addValueWithStyle(PdfPTable table, String text, Font font) {
        PdfPCell valueCell = new PdfPCell(new Phrase(text, font));
        valueCell.setBorder(Rectangle.BOTTOM); // Show only the bottom border
        valueCell.setBorderColorBottom(BaseColor.BLACK);
        valueCell.setBorderWidthBottom(1f); // Set the thickness of the bottom border
        valueCell.setBorderWidthLeft(0f); // Remove left border
        valueCell.setBorderWidthRight(0f); // Remove right border
        valueCell.setHorizontalAlignment(Element.ALIGN_LEFT);
        valueCell.setPaddingTop(5f);
        valueCell.setPaddingBottom(8f);
        table.addCell(valueCell);
    }

    private String getCurrentTime() {
        Date now = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return sdf.format(now);
    }
}
