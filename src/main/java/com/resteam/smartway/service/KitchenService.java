package com.resteam.smartway.service;

import com.resteam.smartway.domain.order.notifications.ReadyToServeNotification;
import com.resteam.smartway.service.dto.order.KitchenItemsDTO;
import com.resteam.smartway.service.dto.order.notification.NotifyReadyToServeDTO;
import com.resteam.smartway.service.dto.order.notification.ServeItemsDTO;
import java.util.UUID;

public interface KitchenService {
    KitchenItemsDTO getAllOrderItemInKitchen();

    ReadyToServeNotification markReadyToServe(NotifyReadyToServeDTO dto);

    void hideRTS(UUID rtsId);
}
