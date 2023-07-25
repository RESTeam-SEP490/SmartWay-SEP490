package com.resteam.smartway.service;

import com.resteam.smartway.service.dto.order.*;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SwOrderService {
    SwOrderDTO createOrder(OrderCreationDTO orderDTO);

    SwOrderDTO getOrderById(UUID orderId);

    public void deleteOrder(UUID orderId);

    public SwOrderDTO updateOrder(UUID orderId, SwOrderDTO orderDTO);

    void addItemToOrder(OrderDetailDTO orderDetailDTO);

    void adjustItemQuantity(OrderAdjustQuantityDTO dto);

    void notifyKitchen(UUID orderId);

    List<OrderDetailDTO> getOrderDetailsForTable(UUID tableId);

    List<OrderDetailDTO> getUncookedOrderDetailsForKitchen();

    Page<SwOrderDTO> findNotPaidOrders(Pageable pageable);

    List<SwOrderDTO> getAllIsPaidFalseOrder();

    OrderDetailDTO addNote(DetailAddNoteDTO detailAddNoteDTO);
}
