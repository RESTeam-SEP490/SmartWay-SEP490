package com.resteam.smartway.service;

import com.itextpdf.text.DocumentException;
import com.resteam.smartway.service.dto.BillDTO;
import com.resteam.smartway.service.dto.order.*;
import com.resteam.smartway.service.dto.order.notification.CancellationDTO;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.SneakyThrows;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    Page<BillDTO> loadAllBillWithSort(Instant startDay, Instant endDay, UUID tableId, Pageable pageable);

    @SneakyThrows
    byte[] generatePdfBillWithReturnItem(PrintBillDTO printBillDTO) throws DocumentException;

    void returnItem(ReturnItemDTO returnItemDTO);

    OrderDTO createOrder(OrderCreationDTO orderDTO);
    OrderDTO createTakeAwayOrder();

    OrderDTO adjustDetailQuantity(OrderDetailAdjustQuantityDTO dto);

    OrderDTO addOrderDetail(OrderDetailAdditionDTO orderDetailDTO);

    OrderDTO notifyKitchen(UUID orderId);

    List<OrderDTO> getAllActiveOrders();

    OrderDTO setOrderIsCompleted(UUID orderId);

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
    OrderDTO checkOut(PaymentDTO dto);

    byte[] generatePdfOrderForNotificationKitchen(List<UUID> ids) throws DocumentException;

    OrderDTO cancelOrder(OrderCancellationDTO dto);
}
