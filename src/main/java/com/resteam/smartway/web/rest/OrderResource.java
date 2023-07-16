package com.resteam.smartway.web.rest;

import com.resteam.smartway.service.OrderDetailServiceImpl;
import com.resteam.smartway.service.SwOrderServiceImpl;
import com.resteam.smartway.service.dto.OrderDetailDTO;
import com.resteam.smartway.service.dto.SwOrderDTO;
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

    private final OrderDetailServiceImpl orderDetailService;
    private final SwOrderServiceImpl swOrderService;

    @PostMapping
    public ResponseEntity<SwOrderDTO> createOrder(@RequestBody SwOrderDTO swOrderDTO) {
        SwOrderDTO createdOrder = swOrderService.createOrder(swOrderDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
    }

    @PostMapping("/add-item")
    public ResponseEntity<SwOrderDTO> addItemToOrder(@RequestParam UUID orderId, @RequestParam UUID menuItemId) {
        SwOrderDTO updatedOrder = swOrderService.addItemToOrder(orderId, menuItemId);
        return ResponseEntity.ok(updatedOrder);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<SwOrderDTO> getOrderById(@PathVariable UUID orderId) {
        SwOrderDTO order = swOrderService.getOrderById(orderId);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{orderId}")
    public ResponseEntity<SwOrderDTO> updateOrder(@PathVariable UUID orderId, @RequestBody SwOrderDTO swOrderDTO) {
        SwOrderDTO updatedOrder = swOrderService.updateOrder(orderId, swOrderDTO);
        return ResponseEntity.ok(updatedOrder);
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable UUID orderId) {
        swOrderService.deleteOrder(orderId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{orderId}/order-details")
    public List<OrderDetailDTO> viewOrderDetails(@PathVariable UUID orderId) {
        SwOrderDTO orderDTO = swOrderService.getOrderById(orderId);
        return orderDTO.getItems();
    }
}
