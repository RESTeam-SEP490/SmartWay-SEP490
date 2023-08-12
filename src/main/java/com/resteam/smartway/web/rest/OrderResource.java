package com.resteam.smartway.web.rest;

import com.itextpdf.text.DocumentException;
import com.resteam.smartway.service.OrderService;
import com.resteam.smartway.service.PaymentDTO;
import com.resteam.smartway.service.dto.order.*;
import com.resteam.smartway.service.dto.order.notification.CancellationDTO;
import com.resteam.smartway.web.websocket.KitchenWebsocket;
import com.resteam.smartway.web.websocket.OrderWebsocket;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
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

    private static final String ENTITY_NAME = "order";

    private final OrderService orderService;
    private final OrderWebsocket orderWebsocket;
    private final KitchenWebsocket kitchenWebsocket;

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody OrderCreationDTO orderDTO) {
        OrderDTO createdOrder = orderService.createOrder(orderDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
    }

    @PostMapping("/take-away")
    public ResponseEntity<OrderDTO> createTakeAwayOrder() {
        OrderDTO createdOrder = orderService.createTakeAwayOrder();
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
    }

    @GetMapping("/active-orders")
    public ResponseEntity<List<OrderDTO>> getAllActiveOrders() {
        List<OrderDTO> notPaidOrders = orderService.getAllActiveOrders();
        return ResponseEntity.ok(notPaidOrders);
    }

    @PutMapping("/add-note")
    public ResponseEntity<OrderDTO> addNoteToOrderDetail(@Valid @RequestBody DetailAddNoteDTO dto) {
        OrderDTO orderDTO = orderService.addNoteToOrderDetail(dto);
        orderWebsocket.sendMessageAfterAddNote(orderDTO);
        return ResponseEntity.ok(orderDTO);
    }

    @PutMapping("/{orderId}/group-tables")
    public ResponseEntity<OrderDTO> groupOrders(@PathVariable UUID orderId, @NotEmpty @RequestBody List<String> tableIds) {
        OrderDTO groupedOrderDTO = orderService.groupTables(orderId, tableIds);
        orderWebsocket.sendMessageAfterAddNote(groupedOrderDTO);
        return ResponseEntity.ok(groupedOrderDTO);
    }

    @PostMapping("/{orderId}/ungroup-tables")
    public ResponseEntity<Void> ungroupTables(@PathVariable UUID orderId, @RequestBody List<String> tableIds) {
        OrderDTO orderDTO = orderService.findById(orderId);
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

    @GetMapping("/{id}/print-bill")
    public ResponseEntity<byte[]> exportPdfForOrder(@PathVariable UUID id) {
        try {
            byte[] pdfContent = orderService.generatePdfOrder(id);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("inline", "_order_" + id + ".pdf");

            return new ResponseEntity<>(pdfContent, headers, HttpStatus.OK);
        } catch (DocumentException e) {
            // Handle exception appropriately
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/pay")
    public ResponseEntity<byte[]> exportPdfForOrderForPay(@RequestBody PaymentDTO paymentDTO) {
        byte[] pdfContent = orderService.generatePdfOrderForPay(paymentDTO);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("inline", "_order_" + paymentDTO.getOrderId() + ".pdf");
        headers.add("paid-order-id", paymentDTO.getOrderId().toString());

        orderWebsocket.sendMessageAfterPayment(paymentDTO.getOrderId());
        return new ResponseEntity<>(pdfContent, headers, HttpStatus.OK);
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

    @PostMapping("/cancel-order-detail")
    public ResponseEntity<OrderDTO> changePriority(@RequestBody CancellationDTO dto) {
        OrderDTO updatedOrder = orderService.cancelOrderDetail(dto);
        orderWebsocket.sendMessageAfterAddNote(updatedOrder);

        kitchenWebsocket.sendCancelMessageToKitchenScreen(updatedOrder);
        return ResponseEntity.ok(updatedOrder);
    }
}
