package com.resteam.smartway.service;

import com.resteam.smartway.service.dto.OrderCreationDTO;
import com.resteam.smartway.service.dto.OrderDetailDTO;
import com.resteam.smartway.service.dto.SwOrderDTO;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SwOrderService {
    SwOrderDTO createOrder(OrderCreationDTO orderDTO);

    SwOrderDTO getOrderById(UUID orderId);

    public void deleteOrder(UUID orderId);

    public SwOrderDTO updateOrder(UUID orderId, SwOrderDTO orderDTO);

    OrderDetailDTO addItemToOrder(OrderDetailDTO orderDetailDTO);

    List<OrderDetailDTO> getOrderDetailsForTable(UUID tableId);

    List<OrderDetailDTO> getUncookedOrderDetailsForKitchen();

    Page<SwOrderDTO> findNotPaidOrders(Pageable pageable);
}
