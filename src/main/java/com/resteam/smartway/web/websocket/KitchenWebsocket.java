package com.resteam.smartway.web.websocket;

import com.resteam.smartway.domain.order.OrderDetail;
import com.resteam.smartway.domain.order.notifications.ReadyToServeNotification;
import com.resteam.smartway.repository.order.KitchenNotificationHistoryRepository;
import com.resteam.smartway.security.CustomUserDetails;
import com.resteam.smartway.security.multitenancy.context.RestaurantContext;
import com.resteam.smartway.service.KitchenService;
import com.resteam.smartway.service.OrderService;
import com.resteam.smartway.service.dto.order.OrderDTO;
import com.resteam.smartway.service.dto.order.notification.NotifyReadyToServeDTO;
import com.resteam.smartway.service.dto.order.notification.ServeItemsDTO;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
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

    private final KitchenNotificationHistoryRepository kitchenNotificationHistoryRepository;
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
        sendMessageToUpdateKitchenScreen();

        if (readyToServeNotification != null) {
            int adjustQuantity =
                readyToServeNotification.getQuantity() -
                readyToServeNotification.getServedQuantity() -
                readyToServeNotification
                    .getItemCancellationNotificationList()
                    .stream()
                    .reduce(0, (sum, icn) -> sum + icn.getQuantity(), Integer::sum);
            sendAlertToOrders("has-ready-to-serve-item", readyToServeNotification, adjustQuantity);
        }
    }

    public void sendCancelMessageToKitchenScreen(OrderDTO dto) {
        kitchenNotificationHistoryRepository
            .findById(dto.getKitchenNotificationHistoryList().get(dto.getKitchenNotificationHistoryList().size() - 1).getId())
            .ifPresent(kitchenNotificationHistory -> {
                boolean isKitchenItemsChanged = kitchenNotificationHistory
                    .getItemCancellationNotificationList()
                    .stream()
                    .anyMatch(icn -> icn.getOrderDetail() == null);
                if (isKitchenItemsChanged) {
                    simpMessagingTemplate.convertAndSend(
                        String.format("/kitchen/%s/receive-order-cancellation", RestaurantContext.getCurrentRestaurant().getId()),
                        kitchenService.getAllOrderItemInKitchen()
                    );
                }
            });
    }

    @MessageMapping("/hide-rts")
    public void notifyServed(@Valid @Payload UUID rtsId, Principal principal) {
        setRestaurantContext(principal);
        kitchenService.hideRTS(rtsId);
        sendMessageToUpdateKitchenScreen();
    }

    public void sendAlertToOrders(String destinationPath, ReadyToServeNotification readyToServeNotification, int adjustQuantity) {
        OrderDetail orderDetail = readyToServeNotification.getItemAdditionNotification().getOrderDetail();
        String itemInfo = String.format(
            "%s - %s - %s",
            adjustQuantity,
            orderDetail.getMenuItem().getName(),
            orderDetail.getOrder().isTakeAway()
                ? orderDetail.getOrder().getCode() + (" (Takeaway)")
                : readyToServeNotification.getItemAdditionNotification().getOrderDetail().getOrder().getTableList().get(0).getName()
        );
        Map<String, Object> headers = new HashMap<>();
        headers.put("item", itemInfo);
        simpMessagingTemplate.convertAndSend(
            String.format("/orders/%s/%s", RestaurantContext.getCurrentRestaurant().getId(), destinationPath),
            orderService.findById(readyToServeNotification.getItemAdditionNotification().getOrderDetail().getOrder().getId()),
            headers
        );
    }

    public void sendMessageToUpdateKitchenScreen() {
        simpMessagingTemplate.convertAndSend(
            String.format(RECEIVE_DESTINATION_FORMAT, RestaurantContext.getCurrentRestaurant().getId()),
            kitchenService.getAllOrderItemInKitchen()
        );
    }

    private void setRestaurantContext(Principal principal) {
        CustomUserDetails userDetails = (CustomUserDetails) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
        RestaurantContext.setCurrentRestaurant(userDetails.getRestaurant());
    }
}
