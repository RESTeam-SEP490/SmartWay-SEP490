package com.resteam.smartway.service;

import com.resteam.smartway.service.dto.OrderDetailDTO;
import com.resteam.smartway.service.dto.SwOrderDTO;
import java.util.List;
import java.util.UUID;

public interface SwOrderService {
    SwOrderDTO createOrder(SwOrderDTO orderDTO);

    SwOrderDTO getOrderById(UUID orderId);

    public void deleteOrder(UUID orderId);

    public SwOrderDTO updateOrder(UUID orderId, SwOrderDTO orderDTO);

    OrderDetailDTO addItemToOrder(OrderDetailDTO orderDetailDTO);

    List<OrderDetailDTO> getOrderDetailsForTable(UUID tableId);

    List<OrderDetailDTO> getUncookedOrderDetailsForKitchen();
}
