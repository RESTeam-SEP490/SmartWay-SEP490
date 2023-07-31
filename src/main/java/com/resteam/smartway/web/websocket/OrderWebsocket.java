package com.resteam.smartway.web.websocket;

import com.resteam.smartway.security.multitenancy.context.RestaurantContext;
import com.resteam.smartway.service.OrderDetailService;
import com.resteam.smartway.service.OrderService;
import com.resteam.smartway.service.dto.order.*;
import com.resteam.smartway.service.dto.order.notification.OrderDetailPriorityDTO;
import java.util.Objects;
import java.util.UUID;
import javax.validation.Valid;
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

    private final OrderService orderService;
    private final OrderDetailService orderDetailService;

    public static final String RESTAURANT_ID_HEADER = "X-restaurant-subdomain";

    @MessageMapping("/topic/create-order/{restaurantId}")
    @SendTo("/topic/receive-changed-order/{restaurantId}")
    public OrderDTO createOrder(@Valid @Payload OrderCreationDTO dto, StompHeaderAccessor stompHeaderAccessor) {
        setRestaurantContext(stompHeaderAccessor);
        return orderService.createOrder(dto);
    }

    @MessageMapping("/topic/adjust-detail-quantity/{restaurantId}")
    @SendTo("/topic/receive-changed-order/{restaurantId}")
    public OrderDTO adjustOrderDetailQuantity(@Valid @Payload OrderDetailAdjustQuantityDTO dto, StompHeaderAccessor stompHeaderAccessor) {
        setRestaurantContext(stompHeaderAccessor);
        return orderService.adjustDetailQuantity(dto);
    }

    @MessageMapping("/topic/add-note/{restaurantId}")
    @SendTo("/topic/receive-changed-order/{restaurantId}")
    public OrderDTO addNoteToOrderDetail(@Valid @Payload DetailAddNoteDTO dto, StompHeaderAccessor stompHeaderAccessor) {
        setRestaurantContext(stompHeaderAccessor);
        return orderService.addNoteToOrderDetail(dto);
    }

    @MessageMapping("/topic/add-order-detail/{restaurantId}")
    @SendTo("/topic/receive-changed-order/{restaurantId}")
    public OrderDTO addOrderDetail(@Payload OrderDetailAdditionDTO dto, StompHeaderAccessor stompHeaderAccessor) {
        setRestaurantContext(stompHeaderAccessor);
        return orderService.addOrderDetail(dto);
    }

    @MessageMapping("/topic/notify-kitchen/{restaurantId}")
    @SendTo("/topic/receive-changed-order/{restaurantId}")
    public OrderDTO notifyKitchen(@Payload UUID orderId, StompHeaderAccessor stompHeaderAccessor) {
        setRestaurantContext(stompHeaderAccessor);
        return orderService.notifyKitchen(orderId);
    }

    @MessageMapping("/topic/delete-order-detail/{restaurantId}")
    @SendTo("/topic/receive-changed-order/{restaurantId}")
    public OrderDTO deleteOrderDetail(@Payload UUID orderId, StompHeaderAccessor stompHeaderAccessor) {
        setRestaurantContext(stompHeaderAccessor);
        return orderService.deleteOrderDetail(orderId);
    }

    //    @MessageMapping("/topic/orders-event/{resSubdomain}")
    //    @SendTo("/topic/orders/{resSubdomain}")
    //    public OrderDTO createOrder(@Payload OrderEventDTO eventDTO, StompHeaderAccessor stompHeaderAccessor)
    //        throws JsonProcessingException {
    //        setRestaurantContext(stompHeaderAccessor);
    //        switch (eventDTO.getType()) {
    //            case CREATE_ORDER:
    //                {
    //                    OrderCreationDTO dto = mapper.readValue(eventDTO.getRawData(), OrderCreationDTO.class);
    //                    return orderService.createOrder(dto);
    //                }
    ////            case ADD_ITEM:
    ////                {
    ////                    OrderDetailDTO dto = mapper.readValue(eventDTO.getRawData(), OrderDetailDTO.class);
    ////                    orderService.addItemToOrder(dto);
    ////                    break;
    ////                }
    ////            case ADJUST_ITEM_QUANTITY:
    ////                {
    ////                    OrderAdjustQuantityDTO dto = mapper.readValue(eventDTO.getRawData(), OrderAdjustQuantityDTO.class);
    ////                    orderService.adjustItemQuantity(dto);
    ////                    break;
    ////                }
    //            case NOTIFY_KITCHEN:
    //                {
    //                    UUID orderId = UUID.fromString(eventDTO.getRawData());
    //                    orderService.notifyKitchen(orderId);
    //                    break;
    //                }
    //            case DELETE_ITEM:
    //                {
    //                    UUID detailId = UUID.fromString(eventDTO.getRawData());
    //                    orderDetailService.deleteOrderDetail(detailId);
    //                }
    //        }
    //        return orderService.getOrderById(eventDTO.getOrderId());
    //    }

    private void setRestaurantContext(StompHeaderAccessor stompHeaderAccessor) {
        String resId = Objects.requireNonNull(stompHeaderAccessor.getNativeHeader(RESTAURANT_ID_HEADER)).get(0);
        RestaurantContext.setCurrentRestaurantById(resId);
    }

    @MessageMapping("/topic/change-priority/{restaurantId}")
    @SendTo("/topic/receive-changed-order/{restaurantId}")
    public OrderDTO changePriority(@Valid @Payload OrderDetailPriorityDTO orderDetailDTO, StompHeaderAccessor stompHeaderAccessor) {
        setRestaurantContext(stompHeaderAccessor);
        return orderService.changePriority(orderDetailDTO);
    }
}
