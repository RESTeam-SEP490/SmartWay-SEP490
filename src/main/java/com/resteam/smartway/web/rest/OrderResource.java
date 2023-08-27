package com.resteam.smartway.web.rest;

import com.itextpdf.text.DocumentException;
import com.resteam.smartway.domain.order.notifications.ReadyToServeNotification;
import com.resteam.smartway.service.OrderService;
import com.resteam.smartway.service.PaymentDTO;
import com.resteam.smartway.service.dto.order.*;
import com.resteam.smartway.service.dto.order.notification.CancellationDTO;
import com.resteam.smartway.service.dto.order.notification.ServeItemsDTO;
import com.resteam.smartway.web.websocket.KitchenWebsocket;
import com.resteam.smartway.web.websocket.OrderWebsocket;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/orders")
@Transactional
@RequiredArgsConstructor
public class OrderResource {

    private final OrderService orderService;
    private final OrderWebsocket orderWebsocket;
    private final KitchenWebsocket kitchenWebsocket;

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody OrderCreationDTO orderDTO) {
        OrderDTO createdOrder = orderService.createOrder(orderDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
    }

    @GetMapping("/active-orders")
    public ResponseEntity<List<OrderDTO>> getAllActiveOrders() {
        List<OrderDTO> notPaidOrders = orderService.getAllActiveOrders();
        return ResponseEntity.ok(notPaidOrders);
    }

    @PutMapping("/serve-items")
    public ResponseEntity<Void> notifyServed(@Valid @RequestBody ServeItemsDTO dto) {
        ReadyToServeNotification readyToServeNotification = orderService.markServed(dto);
        kitchenWebsocket.sendMessageToUpdateKitchenScreen();

        kitchenWebsocket.sendAlertToOrders("has-served-item", readyToServeNotification, dto.getServeQuantity());

        return ResponseEntity.ok().build();
    }

    @PutMapping("/free-up-table")
    public ResponseEntity<OrderDTO> setOrderIsCompleted(@RequestParam UUID orderId) {
        OrderDTO completedOrder = orderService.setOrderIsCompleted(orderId);
        orderWebsocket.sendMessageToHideOrder(orderId);
        return ResponseEntity.ok(completedOrder);
    }

    @PutMapping("/add-note")
    public ResponseEntity<OrderDTO> addNoteToOrderDetail(@Valid @RequestBody DetailAddNoteDTO dto) {
        OrderDTO orderDTO = orderService.addNoteToOrderDetail(dto);
        orderWebsocket.sendMessageToChangedOrder(orderDTO);
        return ResponseEntity.ok(orderDTO);
    }

    @PutMapping("/{orderId}/group-tables")
    public ResponseEntity<OrderDTO> groupOrders(@PathVariable UUID orderId, @RequestBody List<String> tableIds) {
        OrderDTO groupedOrderDTO = orderService.groupTables(orderId, tableIds);
        orderWebsocket.sendMessageToChangedOrder(groupedOrderDTO);
        return ResponseEntity.ok(groupedOrderDTO);
    }

    @PostMapping("/{orderId}/ungroup-tables")
    public ResponseEntity<Void> ungroupTables(@PathVariable UUID orderId, @RequestBody List<String> tableIds) {
        orderService.ungroupTables(orderId, tableIds);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{orderId}/change-priority")
    public ResponseEntity<OrderDTO> changePriority(@PathVariable UUID orderId, @RequestBody OrderDetailPriorityDTO orderDetailPriorityDTO) {
        orderDetailPriorityDTO.setOrderId(orderId);
        OrderDTO updatedOrder = orderService.changePriority(orderDetailPriorityDTO);
        return ResponseEntity.ok(updatedOrder);
    }

    @PostMapping("/{orderId}/split-order")
    public ResponseEntity<OrderDTO> splitOrder(@PathVariable UUID orderId, @RequestBody SplitOrderDTO splitOrderDTO) {
        OrderDTO orderDTO = orderService.findById(orderId);
        OrderDTO newOrderDTO = orderService.splitOrder(
            orderDTO.getId(),
            splitOrderDTO.getTargetTableId(),
            splitOrderDTO.getOrderDetailIds()
        );
        return ResponseEntity.ok(newOrderDTO);
    }

    @PostMapping("/print-bill")
    public ResponseEntity<byte[]> exportPdfForOrder(@RequestBody PrintBillDTO printBillDTO) {
        try {
            byte[] pdfContent = orderService.generatePdfBillWithReturnItem(printBillDTO);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("inline", "_order_" + printBillDTO.getOrderId() + ".pdf");

            return new ResponseEntity<>(pdfContent, headers, HttpStatus.OK);
        } catch (DocumentException e) {
            // Handle exception appropriately
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/check-out")
    public ResponseEntity<byte[]> checkOut(@RequestBody PaymentDTO paymentDTO) {
        OrderDTO orderDTO = orderService.checkOut(paymentDTO);
        HttpHeaders headers = new HttpHeaders();
        if (paymentDTO.isFreeUpTable()) {
            orderWebsocket.sendMessageToHideOrder(paymentDTO.getOrderId());
        } else {
            orderWebsocket.sendMessageToChangedOrder(orderDTO);
        }
        try {
            byte[] pdfContent = orderService.generatePdfBillWithReturnItem(
                new PrintBillDTO(paymentDTO.getOrderId(), List.of(), paymentDTO.getDiscount())
            );

            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("inline", "_order_" + paymentDTO.getOrderId() + ".pdf");

            return new ResponseEntity<>(pdfContent, headers, HttpStatus.OK);
        } catch (DocumentException e) {
            // Handle exception appropriately
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/export-notificationKitchen")
    public ResponseEntity<byte[]> exportPdfForNotificationKitchen(@RequestBody Map<String, List<UUID>> request) {
        List<UUID> ids = request.get("ids");
        try {
            byte[] pdfContent = orderService.generatePdfOrderForNotificationKitchen(ids);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("inline", "_orderTicket_" + ".pdf");

            return new ResponseEntity<>(pdfContent, headers, HttpStatus.OK);
        } catch (DocumentException e) {
            // Handle exception appropriately
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/cancel-order-detail")
    public ResponseEntity<OrderDTO> cancelOrderDetail(@RequestBody CancellationDTO dto) {
        OrderDTO updatedOrder = orderService.cancelOrderDetail(dto);
        orderWebsocket.sendMessageToChangedOrder(updatedOrder);

        kitchenWebsocket.sendCancelMessageToKitchenScreen(updatedOrder);
        return ResponseEntity.ok(updatedOrder);
    }

    @PutMapping("/cancel-order")
    public ResponseEntity<OrderDTO> cancelOrder(@RequestBody OrderCancellationDTO dto) {
        OrderDTO updatedOrder = orderService.cancelOrder(dto);
        orderWebsocket.sendMessageToHideOrder(dto.getOrderId());
        if (
            updatedOrder != null && !updatedOrder.getKitchenNotificationHistoryList().isEmpty()
        ) kitchenWebsocket.sendCancelMessageToKitchenScreen(updatedOrder);
        return ResponseEntity.ok(updatedOrder);
    }

    @PutMapping("/change-is-require-check-out")
    public ResponseEntity<Void> requireCheckOut(@RequestBody RequireCheckOutDTO dto) {
        OrderDTO updatedOrder = orderService.changeRequireToCheckOut(dto);
        orderWebsocket.sendMessageToChangedOrder(updatedOrder);
        return ResponseEntity.ok().build();
    }
}
