package com.resteam.smartway.service.mapper.order.notification;

import com.resteam.smartway.domain.order.notifications.ItemCancellationNotification;
import com.resteam.smartway.service.dto.order.notification.ItemCancellationNotificationDTO;
import com.resteam.smartway.service.mapper.base.EntityMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface ItemCancellationNotificationMapper extends EntityMapper<ItemCancellationNotificationDTO, ItemCancellationNotification> {
    ItemCancellationNotification toEntity(ItemCancellationNotificationDTO dto);

    @Mappings(
        {
            @Mapping(target = "createdBy", source = "kitchenNotificationHistory.createdBy"),
            @Mapping(target = "menuItemName", source = ".", qualifiedByName = "menuItemName"),
            @Mapping(target = "notifiedTime", source = "kitchenNotificationHistory.notifiedTime"),
        }
    )
    ItemCancellationNotificationDTO toDto(ItemCancellationNotification entity);

    @Named("menuItemName")
    default String menuItemName(ItemCancellationNotification entity) {
        if (entity.getItemAdditionNotification() != null) {
            return entity.getItemAdditionNotification().getOrderDetail().getMenuItem().getName();
        } else if (entity.getReadyToServeNotification() != null) return entity
            .getReadyToServeNotification()
            .getItemAdditionNotification()
            .getOrderDetail()
            .getMenuItem()
            .getName();
        return entity.getOrderDetail().getMenuItem().getName();
    }
}
