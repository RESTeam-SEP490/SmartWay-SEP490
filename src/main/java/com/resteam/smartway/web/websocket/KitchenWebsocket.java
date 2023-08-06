package com.resteam.smartway.web.websocket;

import com.resteam.smartway.domain.order.notifications.ReadyToServeNotification;
import com.resteam.smartway.security.CustomUserDetails;
import com.resteam.smartway.security.multitenancy.context.RestaurantContext;
import com.resteam.smartway.service.KitchenService;
import com.resteam.smartway.service.OrderService;
import com.resteam.smartway.service.dto.order.notification.NotifyReadyToServeDTO;
import com.resteam.smartway.service.dto.order.notification.NotifyServedDTO;
import com.resteam.smartway.service.mapper.order.notification.ReadyToServeNotificationMapper;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

@Controller
@RequiredArgsConstructor
@MessageMapping("/kitchen/{restaurantId}")
@Slf4j
@Transactional
public class KitchenWebsocket {

    private final KitchenService kitchenService;
    private final OrderService orderService;
    private final ReadyToServeNotificationMapper readyToServeNotificationMapper;
    private final SimpMessagingTemplate simpMessagingTemplate;
    public static final String RECEIVE_DESTINATION_FORMAT = "/kitchen/%s/update-items";

    @SneakyThrows
    @MessageMapping("/notify-ready-to-serve")
    public void notifyReadyToServe(
        @Valid @Payload NotifyReadyToServeDTO dto,
        @DestinationVariable String restaurantId,
        Principal principal
    ) {
        setRestaurantContext(principal);
        ReadyToServeNotification readyToServeNotification = kitchenService.markReadyToServe(dto);
        simpMessagingTemplate.convertAndSend(
            String.format(RECEIVE_DESTINATION_FORMAT, restaurantId),
            kitchenService.getAllOrderItemInKitchen()
        );

        sendAlertToOrders("has-ready-to-serve-item", readyToServeNotification);
    }

    @MessageMapping("/notify-served")
    public void notifyServed(@Valid @Payload NotifyServedDTO dto, @DestinationVariable String restaurantId, Principal principal) {
        setRestaurantContext(principal);
        ReadyToServeNotification readyToServeNotification = kitchenService.markServed(dto);
        simpMessagingTemplate.convertAndSend(
            String.format(RECEIVE_DESTINATION_FORMAT, restaurantId),
            kitchenService.getAllOrderItemInKitchen()
        );

        sendAlertToOrders("has-served-item", readyToServeNotification);
    }

    private void sendAlertToOrders(String destinationPath, ReadyToServeNotification readyToServeNotification) {
        String itemInfo = String.format(
            "%s - %s - %s",
            readyToServeNotification.getQuantity(),
            readyToServeNotification.getItemAdditionNotification().getOrderDetail().getMenuItem().getName(),
            readyToServeNotification.getItemAdditionNotification().getOrderDetail().getOrder().getTableList().get(0).getName()
        );
        Map<String, Object> headers = new HashMap<>();
        headers.put("item", itemInfo);
        simpMessagingTemplate.convertAndSend(
            String.format("/orders/%s/%s", RestaurantContext.getCurrentRestaurant().getId(), destinationPath),
            orderService.findById(readyToServeNotification.getItemAdditionNotification().getOrderDetail().getOrder().getId()),
            headers
        );
    }

    private void setRestaurantContext(Principal principal) {
        CustomUserDetails userDetails = (CustomUserDetails) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
        RestaurantContext.setCurrentRestaurantById(userDetails.getRestaurantId());
    }
}
