package com.resteam.smartway.service;

import com.resteam.smartway.service.dto.SwOrderDTO;
import java.util.UUID;

public interface SwOrderService {
    SwOrderDTO createOrder(SwOrderDTO orderDTO);

    SwOrderDTO getOrderById(UUID orderId);

    public void deleteOrder(UUID orderId);

    public SwOrderDTO updateOrder(UUID orderId, SwOrderDTO orderDTO);
}
