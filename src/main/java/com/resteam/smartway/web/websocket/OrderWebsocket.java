package com.resteam.smartway.web.websocket;

import com.resteam.smartway.security.CustomUserDetails;
import com.resteam.smartway.security.multitenancy.context.RestaurantContext;
import com.resteam.smartway.service.KitchenService;
import com.resteam.smartway.service.OrderService;
import com.resteam.smartway.service.dto.order.*;
import java.security.Principal;
import java.util.UUID;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@MessageMapping("/orders/{restaurantId}")
@Slf4j
public class OrderWebsocket {

    private final OrderService orderService;
    private final KitchenService kitchenService;

    private final SimpMessagingTemplate simpMessagingTemplate;
    public static final String RECEIVE_DESTINATION_FORMAT = "/orders/%s/receive-changed-order";

    @MessageMapping("/create-order")
    public void createOrder(@Payload OrderCreationDTO dto, @DestinationVariable String restaurantId, Principal principal) {
        setRestaurantContext(principal);
        OrderDTO orderDTO;
        if (dto.getTableIdList().size() > 0) {
            orderDTO = orderService.createOrder(dto);
        } else {
            orderDTO = orderService.createTakeAwayOrder();
        }
        simpMessagingTemplate.convertAndSend(String.format(RECEIVE_DESTINATION_FORMAT, restaurantId), orderDTO);
    }

    @MessageMapping("/adjust-detail-quantity")
    public void adjustOrderDetailQuantity(
        @Valid @Payload OrderDetailAdjustQuantityDTO dto,
        @DestinationVariable String restaurantId,
        Principal principal
    ) {
        setRestaurantContext(principal);
        OrderDTO orderDTO = orderService.adjustDetailQuantity(dto);
        simpMessagingTemplate.convertAndSend(String.format(RECEIVE_DESTINATION_FORMAT, restaurantId), orderDTO);
    }

    @MessageMapping("/add-order-detail")
    public void addOrderDetail(@Payload OrderDetailAdditionDTO dto, @DestinationVariable String restaurantId, Principal principal) {
        setRestaurantContext(principal);
        simpMessagingTemplate.convertAndSend(String.format(RECEIVE_DESTINATION_FORMAT, restaurantId), orderService.addOrderDetail(dto));
    }

    @MessageMapping("/notify-kitchen")
    public void notifyKitchen(@Payload UUID orderId, @DestinationVariable String restaurantId, Principal principal) {
        setRestaurantContext(principal);
        OrderDTO orderDTO = orderService.notifyKitchen(orderId);

        simpMessagingTemplate.convertAndSend(String.format(RECEIVE_DESTINATION_FORMAT, restaurantId), orderDTO);
        simpMessagingTemplate.convertAndSend(
            String.format("/kitchen/%s/receive-new-items", restaurantId),
            kitchenService.getAllOrderItemInKitchen()
        );
    }

    @MessageMapping("/delete-order-detail")
    public void deleteOrderDetail(@Payload UUID orderId, @DestinationVariable String restaurantId, Principal principal) {
        setRestaurantContext(principal);
        simpMessagingTemplate.convertAndSend(
            String.format(RECEIVE_DESTINATION_FORMAT, restaurantId),
            orderService.deleteOrderDetail(orderId)
        );
    }

    @MessageMapping("/change-priority")
    public void changePriority(
        @Valid @Payload OrderDetailPriorityDTO orderDetailDTO,
        @DestinationVariable String restaurantId,
        Principal principal
    ) {
        setRestaurantContext(principal);
        simpMessagingTemplate.convertAndSend(
            String.format(RECEIVE_DESTINATION_FORMAT, restaurantId),
            orderService.changePriority(orderDetailDTO)
        );
    }

    public void sendMessageToChangedOrder(OrderDTO dto) {
        simpMessagingTemplate.convertAndSend(
            String.format(RECEIVE_DESTINATION_FORMAT, RestaurantContext.getCurrentRestaurant().getId()),
            dto
        );
    }

    public void sendMessageAfterPayment(UUID id) {
        simpMessagingTemplate.convertAndSend(
            String.format("/orders/%s/receive-new-payment", RestaurantContext.getCurrentRestaurant().getId()),
            id
        );
    }

    private void setRestaurantContext(Principal principal) {
        CustomUserDetails userDetails = (CustomUserDetails) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
        RestaurantContext.setCurrentRestaurant(userDetails.getRestaurant());
    }
}
