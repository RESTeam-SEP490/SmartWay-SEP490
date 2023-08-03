package com.resteam.smartway.service.mapper.order.notification;

import com.resteam.smartway.domain.order.notifications.ItemCancellationNotification;
import com.resteam.smartway.service.dto.order.notification.ItemCancellationNotificationDTO;
import com.resteam.smartway.service.mapper.base.EntityMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface ItemCancellationNotificationMapper extends EntityMapper<ItemCancellationNotificationDTO, ItemCancellationNotification> {
    ItemCancellationNotification toEntity(ItemCancellationNotificationDTO dto);

    @Mappings(
        {
            @Mapping(target = "createdBy", source = "kitchenNotificationHistory.createdBy"),
            @Mapping(target = "notifiedTime", source = "kitchenNotificationHistory.notifiedTime"),
        }
    )
    ItemCancellationNotificationDTO toDto(ItemCancellationNotification entity);
}
