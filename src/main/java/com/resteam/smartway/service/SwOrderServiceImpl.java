package com.resteam.smartway.service;

import com.amazonaws.services.kms.model.NotFoundException;
import com.resteam.smartway.domain.OrderDetail;
import com.resteam.smartway.domain.SwOrder;
import com.resteam.smartway.repository.SwOrderRepository;
import com.resteam.smartway.service.dto.MenuItemDTO;
import com.resteam.smartway.service.dto.SwOrderDTO;
import com.resteam.smartway.service.mapper.MenuItemMapper;
import com.resteam.smartway.service.mapper.SwOrderMapper;
import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class SwOrderServiceImpl implements SwOrderService {

    private final SwOrderRepository swOrderRepository;
    private final SwOrderMapper swOrderMapper;
    private final MenuItemServiceImpl menuItemService;
    private final MenuItemMapper menuItemMapper;

    @Override
    public SwOrderDTO createOrder(SwOrderDTO orderDTO) {
        SwOrder order = swOrderMapper.toEntity(orderDTO);
        order.setId(UUID.randomUUID());
        order.setItems(new ArrayList<>());
        order.setTable(orderDTO.getTableName());
        order.setPaid(false);
        order.setPayDate(null);

        SwOrder savedOrder = swOrderRepository.save(order);
        return swOrderMapper.toDto(savedOrder);
    }

    @Override
    public SwOrderDTO getOrderById(UUID orderId) {
        SwOrder order = swOrderRepository.findById(orderId).orElseThrow(() -> new NotFoundException("Order not found"));
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
        SwOrder existingOrder = swOrderRepository.findById(orderId).orElseThrow(() -> new NotFoundException("Order not found"));
        swOrderRepository.delete(existingOrder);
    }

    @Override
    public SwOrderDTO updateOrder(UUID orderId, SwOrderDTO orderDTO) {
        SwOrder existingOrder = swOrderRepository
            .findById(orderId)
            .orElseThrow(() -> new NotFoundException("Order not found with ID: " + orderId));

        // Cập nhật thong tin
        existingOrder.setCode(orderDTO.getCode());
        existingOrder.setTable(orderDTO.getTableName());

        // Lưu đơn hàng đã được cập nhật
        SwOrder updatedOrder = swOrderRepository.save(existingOrder);
        return swOrderMapper.toDto(updatedOrder);
    }

    public SwOrderDTO addItemToOrder(UUID orderId, UUID menuItemId) {
        SwOrder swOrder = swOrderRepository
            .findById(orderId)
            .orElseThrow(() -> new NotFoundException("Order not found with ID: " + orderId));
        MenuItemDTO menuItemDTO = menuItemService.getMenuItemById(menuItemId);

        // Tạo OrderDetail mới
        OrderDetail orderDetail = new OrderDetail();
        orderDetail.setMenuItem(menuItemMapper.toEntity(menuItemDTO));
        orderDetail.setQuantity(1); // Số lượng mặt hàng

        // Thêm OrderDetail vào danh sách items của đơn hàng
        swOrder.getItems().add(orderDetail);

        swOrderRepository.save(swOrder);
        return swOrderMapper.toDto(swOrder);
    }
}
