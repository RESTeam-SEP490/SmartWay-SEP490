package com.resteam.smartway.web.rest;

import com.resteam.smartway.service.OrderService;
import com.resteam.smartway.service.dto.order.DetailAddNoteDTO;
import com.resteam.smartway.service.dto.order.OrderCreationDTO;
import com.resteam.smartway.service.dto.order.OrderDTO;
import com.resteam.smartway.service.dto.order.OrderDetailPriorityDTO;
import com.resteam.smartway.web.websocket.OrderWebsocket;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
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
    private final OrderWebsocket orderWebsocket;

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

    @PutMapping("/add-note")
    public ResponseEntity<OrderDTO> addNoteToOrderDetail(@RequestBody DetailAddNoteDTO dto) {
        OrderDTO orderDTO = orderService.addNoteToOrderDetail(dto);
        orderWebsocket.sendMessageAfterAddNote(orderDTO);
        return ResponseEntity.ok(orderDTO);
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
}
