package com.resteam.smartway.web.rest;

import com.itextpdf.text.DocumentException;
import com.resteam.smartway.domain.order.SwOrder;
import com.resteam.smartway.service.OrderDetailService;
import com.resteam.smartway.service.OrderService;
import com.resteam.smartway.service.dto.DiningTableDTO;
import com.resteam.smartway.service.dto.order.DetailAddNoteDTO;
import com.resteam.smartway.service.dto.order.OrderCreationDTO;
import com.resteam.smartway.service.dto.order.OrderDTO;
import com.resteam.smartway.service.dto.order.OrderDetailDTO;
import com.resteam.smartway.service.dto.order.notification.ItemAdditionNotificationDTO;
import com.resteam.smartway.service.dto.order.notification.OrderDetailPriorityDTO;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@Log4j2
@RestController
@RequestMapping("/api/orders")
@Transactional
@RequiredArgsConstructor
public class OrderResource {

    private static final String ENTITY_NAME = "order";

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderCreationDTO orderDTO) {
        OrderDTO createdOrder = orderService.createOrder(orderDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
    }

    @GetMapping("/active-orders")
    public ResponseEntity<List<OrderDTO>> getAllActiveOrders() {
        List<OrderDTO> notPaidOrders = orderService.getAllActiveOrders();
        return ResponseEntity.ok(notPaidOrders);
    }

    @GetMapping("/uncompleted-orders")
    public ResponseEntity<List<ItemAdditionNotificationDTO>> getAllUncompletedOrder() {
        return ResponseEntity.ok(orderService.getAllOrderItemInKitchen());
    }

    @PutMapping("/add-note")
    public ResponseEntity<OrderDTO> addNoteToOrderDetail(@RequestBody DetailAddNoteDTO dto) {
        OrderDTO updatedOrder = orderService.addNoteToOrderDetail(dto);
        return ResponseEntity.ok(updatedOrder);
    }

    @PostMapping("/{orderId}/group-tables")
    public ResponseEntity<Void> groupTables(@PathVariable UUID orderId, @RequestBody List<String> tableIds) {
        OrderDTO orderDTO = orderService.findById(orderId);
        orderService.groupTables(orderDTO, tableIds);

        return ResponseEntity.ok().build();
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

    @GetMapping("/{id}/export-pdf")
    public ResponseEntity<byte[]> exportPdfForOrder(@PathVariable UUID id) {
        OrderDTO orderDTO = orderService.findById(id);

        try {
            byte[] pdfContent = orderService.generatePdfOrder(orderDTO);

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

    @PostMapping("/{id}/export-pdf")
    public ResponseEntity<byte[]> exportPdfForOrderForPay(@PathVariable UUID id) {
        OrderDTO orderDTO = orderService.findById(id);

        try {
            byte[] pdfContent = orderService.generatePdfOrderForPay(orderDTO);

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
}
