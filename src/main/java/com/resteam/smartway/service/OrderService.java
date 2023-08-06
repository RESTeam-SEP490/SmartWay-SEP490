package com.resteam.smartway.service;

import com.itextpdf.text.DocumentException;
import com.resteam.smartway.service.dto.order.*;
import java.util.List;
import java.util.UUID;

public interface OrderService {
    OrderDTO createOrder(OrderCreationDTO orderDTO);
    OrderDTO createTakeAwayOrder();

    OrderDTO adjustDetailQuantity(OrderDetailAdjustQuantityDTO dto);

    OrderDTO addOrderDetail(OrderDetailAdditionDTO orderDetailDTO);

    OrderDTO notifyKitchen(UUID orderId);

    List<OrderDTO> getAllActiveOrders();

    OrderDTO deleteOrderDetail(UUID orderDetailId);

    OrderDTO addNoteToOrderDetail(DetailAddNoteDTO dto);

    OrderDTO groupTables(UUID orderId, List<String> ids);

    OrderDTO findById(UUID orderId);

    void ungroupTables(UUID orderId, List<String> tableIds);

    OrderDTO splitOrder(UUID orderId, UUID targetTableId, List<UUID> orderDetailIds);

    OrderDTO changePriority(OrderDetailPriorityDTO orderDetailDTO);

    byte[] generatePdfOrder(OrderDTO orderDTO) throws DocumentException;

    byte[] generatePdfOrderForPay(OrderDTO orderDTO) throws DocumentException;
}
