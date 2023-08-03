package com.resteam.smartway.service.mapper.order.notification;

import com.resteam.smartway.domain.order.notifications.ItemAdditionNotification;
import com.resteam.smartway.service.dto.order.notification.ItemAdditionNotificationDTO;
import com.resteam.smartway.service.mapper.base.EntityMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring", uses = { ItemCancellationNotificationMapper.class })
public interface ItemAdditionNotificationMapper extends EntityMapper<ItemAdditionNotificationDTO, ItemAdditionNotification> {
    ItemAdditionNotification toEntity(ItemAdditionNotificationDTO dto);

    @Mappings(
        {
            @Mapping(target = "menuItemName", source = "orderDetail.menuItem.name"),
            @Mapping(target = "tableList", source = "orderDetail.order.tableList"),
            @Mapping(target = "createdBy", source = "kitchenNotificationHistory.createdBy"),
            @Mapping(target = "notifiedTime", source = "kitchenNotificationHistory.notifiedTime"),
        }
    )
    ItemAdditionNotificationDTO toDto(ItemAdditionNotification entity);
}
