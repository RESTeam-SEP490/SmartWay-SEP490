package com.resteam.smartway.service;

import com.resteam.smartway.service.dto.order.*;
import java.util.List;
import java.util.UUID;

public interface OrderService {
    OrderDTO createOrder(OrderCreationDTO orderDTO);

    OrderDTO adjustDetailQuantity(OrderDetailAdjustQuantityDTO dto);

    OrderDTO addOrderDetail(OrderDetailAdditionDTO orderDetailDTO);

    OrderDTO notifyKitchen(UUID orderId);

    List<OrderDTO> getAllActiveOrders();

    OrderDTO deleteOrderDetail(UUID orderDetailId);
}
