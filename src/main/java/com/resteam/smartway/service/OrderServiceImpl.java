package com.resteam.smartway.service;

import com.resteam.smartway.domain.DiningTable;
import com.resteam.smartway.domain.MenuItem;
import com.resteam.smartway.domain.order.OrderDetail;
import com.resteam.smartway.domain.order.SwOrder;
import com.resteam.smartway.domain.order.notifications.ItemAdditionNotification;
import com.resteam.smartway.domain.order.notifications.KitchenNotificationHistory;
import com.resteam.smartway.repository.DiningTableRepository;
import com.resteam.smartway.repository.MenuItemRepository;
import com.resteam.smartway.repository.order.OrderDetailRepository;
import com.resteam.smartway.repository.order.OrderRepository;
import com.resteam.smartway.service.aws.S3Service;
import com.resteam.smartway.service.dto.order.*;
import com.resteam.smartway.service.mapper.order.OrderDetailMapper;
import com.resteam.smartway.service.mapper.order.OrderMapper;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
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
    private final OrderDetailMapper orderDetailMapper;
    private final OrderDetailRepository orderDetailRepository;
    private final S3Service s3Service;

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
        orderDetail.setServedQuantity(0);

        order.setOrderDetailList(List.of(orderDetail));

        SwOrder savedOrder = orderRepository.save(order);
        orderDetailRepository.save(orderDetail);

        diningTableRepository.saveAll(tableList.stream().peek(table -> table.setIsFree(false)).collect(Collectors.toList()));

        return orderMapper.toDto(savedOrder);
    }

    private OrderDTO sortOrderDetailsAndNotificationHistories(SwOrder order) {
        List<OrderDetail> orderDetails = order
            .getOrderDetailList()
            .stream()
            .sorted((o1, o2) -> {
                if (o1.equals(o2)) return 1; else return -1;
            })
            .collect(Collectors.toList());

        List<KitchenNotificationHistory> kitchenNotificationHistoryList = order.getKitchenNotificationHistoryList();
        kitchenNotificationHistoryList.sort((o1, o2) -> {
            if (o1.equals(o2)) return 1; else return -1;
        });
        order.setKitchenNotificationHistoryList(kitchenNotificationHistoryList);

        OrderDTO result = orderMapper.toDto(order);
        List<OrderDetailDTO> orderDetailDTOList = orderDetails
            .stream()
            .map(detail -> {
                MenuItem menuItem = detail.getMenuItem();
                if (menuItem.getImageKey() != null) {
                    String imageUrl = s3Service.getDownloadUrl(menuItem.getImageKey());
                    menuItem.setImageUrl(imageUrl);
                } else menuItem.setImageUrl("");
                detail.setMenuItem(menuItem);
                return orderDetailMapper.toDto(detail);
            })
            .collect(Collectors.toList());

        result.setOrderDetailList(orderDetailDTOList);

        return result;
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

        if (orderDetail.getUnnotifiedQuantity() == 0) orderDetail.setPriority(false);

        orderDetailRepository.saveAndFlush(orderDetail);
        return sortOrderDetailsAndNotificationHistories(orderDetail.getOrder());
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
        return sortOrderDetailsAndNotificationHistories(orderDetail.getOrder());
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
        orderDetail.setServedQuantity(0);

        OrderDetail savedOrderDetail = orderDetailRepository.saveAndFlush(orderDetail);
        return sortOrderDetailsAndNotificationHistories(savedOrderDetail.getOrder());
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
                    detail.setPriority(false);
                }
            })
            .collect(Collectors.toList());

        kitchenNotificationHistory.setItemAdditionNotificationList(itemAdditionNotificationList);
        List<KitchenNotificationHistory> kitchenNotificationHistoryList = order.getKitchenNotificationHistoryList();
        kitchenNotificationHistoryList.add(kitchenNotificationHistory);
        SwOrder savedOrder = orderRepository.saveAndFlush(order);

        return sortOrderDetailsAndNotificationHistories(savedOrder);
    }

    @Override
    public List<OrderDTO> getAllActiveOrders() {
        return orderRepository
            .findByIsPaidFalse()
            .stream()
            .map(this::sortOrderDetailsAndNotificationHistories)
            .collect(Collectors.toList());
    }

    @Override
    public OrderDTO findById(UUID id) {
        SwOrder order = orderRepository.findById(id).orElseThrow(() -> new BadRequestAlertException("Invalid ID", ORDER, "idnotfound"));
        return sortOrderDetailsAndNotificationHistories(order);
    }

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

        return sortOrderDetailsAndNotificationHistories(order);
    }

    public OrderDTO changePriority(OrderDetailPriorityDTO orderDetailDTO) {
        OrderDetail orderDetail = orderDetailRepository
            .findById(orderDetailDTO.getOrderDetailId())
            .orElseThrow(() -> new BadRequestAlertException("Order detail was not found", ORDER_DETAIL, "idnotfound"));

        if (orderDetail.getOrder().isPaid()) throw new BadRequestAlertException(
            "Order detail you want to edit is in a paid order",
            ORDER,
            "paidOrder"
        );

        if (orderDetail.getUnnotifiedQuantity() == 0) throw new BadRequestAlertException(
            "Order detail you want to prioritize was notified to kitchen",
            ORDER,
            "notifiedOrderDetail"
        );

        orderDetail.setPriority(orderDetailDTO.isPriority());
        OrderDetail savedDetail = orderDetailRepository.saveAndFlush(orderDetail);

        return sortOrderDetailsAndNotificationHistories(savedDetail.getOrder());
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
}
