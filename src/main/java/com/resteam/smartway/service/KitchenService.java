package com.resteam.smartway.service;

import com.resteam.smartway.domain.order.notifications.ReadyToServeNotification;
import com.resteam.smartway.service.dto.order.KitchenItemsDTO;
import com.resteam.smartway.service.dto.order.notification.NotifyReadyToServeDTO;
import com.resteam.smartway.service.dto.order.notification.NotifyServedDTO;

public interface KitchenService {
    KitchenItemsDTO getAllOrderItemInKitchen();

    ReadyToServeNotification markReadyToServe(NotifyReadyToServeDTO dto);

    ReadyToServeNotification markServed(NotifyServedDTO id);
}
