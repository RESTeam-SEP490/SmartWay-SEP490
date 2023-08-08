package com.resteam.smartway.service.mapper.order.notification;

import com.resteam.smartway.domain.order.notifications.ReadyToServeNotification;
import com.resteam.smartway.service.dto.order.notification.ReadyToServeNotificationDTO;
import com.resteam.smartway.service.mapper.base.EntityMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = { ItemCancellationNotificationMapper.class, ItemAdditionNotificationMapper.class })
public interface ReadyToServeNotificationMapper extends EntityMapper<ReadyToServeNotificationDTO, ReadyToServeNotification> {
    ReadyToServeNotification toEntity(ReadyToServeNotificationDTO dto);

    ReadyToServeNotificationDTO toDto(ReadyToServeNotification entity);
}
