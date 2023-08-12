package com.resteam.smartway.service;

import com.itextpdf.text.DocumentException;
import com.resteam.smartway.service.dto.order.*;
import com.resteam.smartway.service.dto.order.notification.CancellationDTO;
import java.util.List;
import java.util.UUID;
import lombok.SneakyThrows;

public interface OrderService {
    OrderDTO returnItem(ReturnItemDTO returnItemDTO);
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

    OrderDTO cancelOrderDetail(CancellationDTO dto);

    byte[] generatePdfOrder(UUID orderId) throws DocumentException;

    @SneakyThrows
    byte[] generatePdfOrderForPay(PaymentDTO dto);

    byte[] generatePdfOrderForNotificationKitchen(List<UUID> ids) throws DocumentException;
}
