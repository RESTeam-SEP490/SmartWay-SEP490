package com.resteam.smartway.service;

import com.amazonaws.services.kms.model.NotFoundException;
import com.resteam.smartway.domain.DiningTable;
import com.resteam.smartway.domain.MenuItem;
import com.resteam.smartway.domain.OrderDetail;
import com.resteam.smartway.domain.SwOrder;
import com.resteam.smartway.repository.DiningTableRepository;
import com.resteam.smartway.repository.MenuItemRepository;
import com.resteam.smartway.repository.OrderDetailRepository;
import com.resteam.smartway.repository.SwOrderRepository;
import com.resteam.smartway.service.dto.order.*;
import com.resteam.smartway.service.mapper.OrderDetailMapper;
import com.resteam.smartway.service.mapper.SwOrderMapper;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class SwOrderServiceImpl implements SwOrderService {

    private final SwOrderRepository swOrderRepository;
    private final SwOrderMapper swOrderMapper;
    private final DiningTableRepository diningTableRepository;
    private final MenuItemRepository menuItemRepository;
    private final OrderDetailMapper orderDetailMapper;
    private final OrderDetailRepository orderDetailRepository;

    private static final String ORDER = "swOrder";
    private static final String TABLE = "table";
    private static final String MENUITEM = "menuItem";
    private static final String ORDERDETAIL = "orderDetail";

    @Override
    public SwOrderDTO createOrder(OrderCreationDTO orderDTO) {
        SwOrder swOrder = new SwOrder();

        DiningTable table = diningTableRepository
            .findById(orderDTO.getTableId())
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", TABLE, "idnotfound"));
        if (table.getIsFree()) {
            swOrder.setTable(table);
            table.setIsFree(false);
        } else throw new BadRequestAlertException("Table not free", TABLE, "notfree");

        MenuItem menuItem = menuItemRepository
            .findById(orderDTO.getMenuItemId())
            .orElseThrow(() -> new NotFoundException("menu Item not found"));

        String orderCode = generateCode();
        swOrder.setCode(orderCode);
        swOrder.setPaid(false);

        OrderDetail orderDetail = new OrderDetail();
        orderDetail.setMenuItem(menuItem);
        orderDetail.setSwOrder(swOrder);
        orderDetail.setCooked(false);
        orderDetail.setQuantity(1);

        swOrder.setItems(List.of(orderDetail));

        SwOrder savedOrder = swOrderRepository.save(swOrder);
        orderDetailRepository.save(orderDetail);

        return swOrderMapper.toDto(savedOrder);
    }

    @Override
    public SwOrderDTO getOrderById(UUID orderId) {
        SwOrder order = swOrderRepository
            .findById(orderId)
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ORDER, "idnotfound"));
        List<OrderDetail> orderDetails = order.getItems();
        orderDetails.sort((o1, o2) -> {
            if (o1.equals(o2)) return 1; else return -1;
        });
        order.setItems(orderDetails);
        return swOrderMapper.toDto(order);
    }

    private String generateCode() {
        Optional<SwOrder> lastOrder = swOrderRepository.findTopByOrderByCodeDesc();
        if (lastOrder.isEmpty()) return "OD000001"; else {
            String lastCode = lastOrder.get().getCode();
            int nextCodeInt = Integer.parseInt(lastCode.substring(2)) + 1;
            if (nextCodeInt > 999999) throw new IllegalStateException("Maximum Code reached");
            return String.format("OD%06d", nextCodeInt);
        }
    }

    @Override
    public void deleteOrder(UUID orderId) {
        SwOrder existingOrder = swOrderRepository
            .findById(orderId)
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ORDER, "idnotfound"));
        swOrderRepository.delete(existingOrder);
    }

    @Override
    public SwOrderDTO updateOrder(UUID orderId, SwOrderDTO orderDTO) {
        SwOrder existingOrder = swOrderRepository
            .findById(orderId)
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ORDER, "idnotfound"));
        //        swOrderMapper.toEntity(e);
        // Cập nhật thong tin
        DiningTable table = diningTableRepository
            .findById(existingOrder.getTable().getId())
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", TABLE, "idnotfound"));
        existingOrder.setTable(table);

        // Lưu đơn hàng đã được cập nhật
        SwOrder updatedOrder = swOrderRepository.save(existingOrder);
        return swOrderMapper.toDto(updatedOrder);
    }

    @Override
    public void addItemToOrder(OrderDetailDTO orderDetailDTO) {
        SwOrder order = swOrderRepository
            .findById(orderDetailDTO.getOrderId())
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ORDER, "idnotfound"));
        MenuItem menuItem = menuItemRepository
            .findById(orderDetailDTO.getMenuItem().getId())
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", MENUITEM, "idnotfound"));

        // Kiểm tra món ăn có đủ trong kho không
        if (!menuItem.getIsInStock()) {
            throw new RuntimeException("Item is out of stock");
        }

        // Thêm món ăn mới vào đơn hàng
        OrderDetail orderDetail = orderDetailMapper.toEntity(orderDetailDTO);
        orderDetail.setSwOrder(order);
        orderDetail.setMenuItem(menuItem);
        orderDetailRepository.save(orderDetail);
    }

    @Override
    public void adjustItemQuantity(OrderAdjustQuantityDTO dto) {
        OrderDetail orderDetail = orderDetailRepository
            .findById(dto.getOrderDetailId())
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ORDERDETAIL, "idnotfound"));
        if (!orderDetail.getMenuItem().getIsInStock()) {
            throw new RuntimeException("Item is out of stock");
        }

        orderDetail.setQuantity(orderDetail.getQuantity() + dto.getQuantityAdjust());
        if (orderDetail.getQuantity() < 1) throw new BadRequestAlertException(
            "Cannot decrease item quantity more",
            ORDERDETAIL,
            "cannotAdjust"
        );
        orderDetailRepository.save(orderDetail);
    }

    @Override
    public void notifyKitchen(UUID orderId) {
        SwOrder order = swOrderRepository
            .findById(orderId)
            .orElseThrow(() -> new BadRequestAlertException("Order not found for the given table", TABLE, "idnotfound"));

        Instant notifyTime = Instant.now();
        List<OrderDetail> orderDetails = order.getItems();
        orderDetails =
            orderDetails
                .stream()
                .map(detail -> {
                    if (detail.getNotifiedTime() == null) detail.setNotifiedTime(notifyTime);
                    return detail;
                })
                .collect(Collectors.toList());

        order.setItems(orderDetails);

        swOrderRepository.save(order);
    }

    @Override
    public List<OrderDetailDTO> getOrderDetailsForTable(UUID tableId) {
        SwOrder swOrder = swOrderRepository
            .findByTableId(tableId)
            .orElseThrow(() -> new BadRequestAlertException("Order not found for the given table", TABLE, "idnotfound"));

        List<OrderDetail> orderDetails = swOrder.getItems();

        // Gộp các OrderDetail cùng menu item lại với nhau
        Map<UUID, OrderDetailDTO> mergedOrderDetails = new HashMap<>();
        for (OrderDetail orderDetail : orderDetails) {
            UUID menuItemId = orderDetail.getMenuItem().getId();
            if (mergedOrderDetails.containsKey(menuItemId)) {
                OrderDetailDTO existingOrderDetailDTO = mergedOrderDetails.get(menuItemId);
                int newQuantity = existingOrderDetailDTO.getQuantity() + orderDetail.getQuantity();
                existingOrderDetailDTO.setQuantity(newQuantity);
            } else {
                OrderDetailDTO orderDetailDTO = orderDetailMapper.toDto(orderDetail);
                mergedOrderDetails.put(menuItemId, orderDetailDTO);
            }
        }

        // Chuyển danh sách đã gộp lại thành danh sách kết quả
        List<OrderDetailDTO> result = new ArrayList<>(mergedOrderDetails.values());
        return result;
    }

    @Override
    public List<OrderDetailDTO> getUncookedOrderDetailsForKitchen() {
        List<OrderDetail> uncookedOrderDetails = orderDetailRepository.findByIsCookedFalseOrderByCreatedDate();
        return orderDetailMapper.toDto(uncookedOrderDetails);
    }

    @Override
    public Page<SwOrderDTO> findNotPaidOrders(Pageable pageable) {
        Page<SwOrder> notPaidOrders = swOrderRepository.findByIsPaidFalse(pageable);
        return notPaidOrders.map(swOrderMapper::toDto);
    }

    @Override
    public List<SwOrderDTO> getAllIsPaidFalseOrder() {
        List<SwOrder> orders = swOrderRepository
            .findByIsPaidFalse()
            .stream()
            .map(order -> {
                List<OrderDetail> orderDetails = order.getItems();
                orderDetails.sort((o1, o2) -> {
                    if (o1.equals(o2)) return 1; else return -1;
                });
                order.setItems(orderDetails);
                return order;
            })
            .collect(Collectors.toList());
        return swOrderMapper.toDto(orders);
    }

    @Override
    public OrderDetailDTO addNote(DetailAddNoteDTO detailAddNoteDTO) {
        OrderDetail orderDetail = orderDetailRepository
            .findById(detailAddNoteDTO.getOrderDetailId())
            .orElseThrow(() -> new BadRequestAlertException("Order detail not found", ORDERDETAIL, "idnotfound"));

        orderDetail.setNote(detailAddNoteDTO.getNote());
        OrderDetail updatedOrderDetail = orderDetailRepository.save(orderDetail);
        return orderDetailMapper.toDto(updatedOrderDetail);
    }
}
