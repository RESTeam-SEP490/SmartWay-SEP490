package com.resteam.smartway.web.websocket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.resteam.smartway.security.multitenancy.context.RestaurantContext;
import com.resteam.smartway.service.OrderDetailService;
import com.resteam.smartway.service.SwOrderService;
import com.resteam.smartway.service.dto.order.OrderAdjustQuantityDTO;
import com.resteam.smartway.service.dto.order.OrderCreationDTO;
import com.resteam.smartway.service.dto.order.OrderDetailDTO;
import com.resteam.smartway.service.dto.order.SwOrderDTO;
import com.resteam.smartway.web.websocket.dto.OrderEventDTO;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class OrderWebsocket {

    private final SwOrderService orderService;
    private final OrderDetailService orderDetailService;

    private final ObjectMapper mapper = new ObjectMapper();

    public static final String RESTAURANT_ID_HEADER = "X-restaurant-subdomain";

    @MessageMapping("/topic/orders-event/{resSubdomain}")
    @SendTo("/topic/orders/{resSubdomain}")
    public SwOrderDTO sendActivity(@Payload OrderEventDTO eventDTO, StompHeaderAccessor stompHeaderAccessor)
        throws JsonProcessingException {
        setRestaurantContext(stompHeaderAccessor);
        switch (eventDTO.getType()) {
            case CREATE_ORDER:
                {
                    OrderCreationDTO dto = mapper.readValue(eventDTO.getRawData(), OrderCreationDTO.class);
                    return orderService.createOrder(dto);
                }
            case ADD_ITEM:
                {
                    OrderDetailDTO dto = mapper.readValue(eventDTO.getRawData(), OrderDetailDTO.class);
                    orderService.addItemToOrder(dto);
                    break;
                }
            case ADJUST_ITEM_QUANTITY:
                {
                    OrderAdjustQuantityDTO dto = mapper.readValue(eventDTO.getRawData(), OrderAdjustQuantityDTO.class);
                    orderService.adjustItemQuantity(dto);
                    break;
                }
            case NOTIFY_KITCHEN:
                {
                    UUID orderId = UUID.fromString(eventDTO.getRawData());
                    orderService.notifyKitchen(orderId);
                    break;
                }
            case DELETE_ITEM:
                {
                    UUID detailId = UUID.fromString(eventDTO.getRawData());
                    orderDetailService.deleteOrderDetail(detailId);
                }
        }
        return orderService.getOrderById(eventDTO.getOrderId());
    }

    private void setRestaurantContext(StompHeaderAccessor stompHeaderAccessor) {
        String resId = Objects.requireNonNull(stompHeaderAccessor.getNativeHeader(RESTAURANT_ID_HEADER)).get(0);
        RestaurantContext.setCurrentRestaurantById(resId);
    }
}
