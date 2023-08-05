package com.resteam.smartway.web.rest;

import com.resteam.smartway.service.OrderService;
import com.resteam.smartway.service.dto.order.*;
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
    public ResponseEntity<OrderDTO> addNoteToOrderDetail(@RequestBody DetailAddNoteDTO dto) {
        OrderDTO orderDTO = orderService.addNoteToOrderDetail(dto);
        orderWebsocket.sendMessageAfterAddNote(orderDTO);
        return ResponseEntity.ok(orderDTO);
    }

    @PutMapping("/{orderId}/group-tables")
    public ResponseEntity<OrderDTO> groupOrders(@PathVariable UUID orderId, @RequestBody List<String> tableIds) {
        OrderDTO groupedOrderDTO = orderService.groupTables(orderId, tableIds);
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
}
