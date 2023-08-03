package com.resteam.smartway.service.mapper.order;

import com.resteam.smartway.domain.order.notifications.ItemAdditionNotification;
import java.util.List;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public class HasReadyToServeItemMapper {

    public boolean asBoolean(List<ItemAdditionNotification> itemAdditionNotificationList) {
        return itemAdditionNotificationList
            .stream()
            .anyMatch(addition -> addition.getReadyToServeNotificationList().stream().anyMatch(rts -> !rts.isCompleted()));
    }
}
