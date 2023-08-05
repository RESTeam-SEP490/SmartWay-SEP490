package com.resteam.smartway.service.mapper.order.notification;

import com.resteam.smartway.domain.order.notifications.ReadyToServeNotification;
import com.resteam.smartway.service.dto.order.notification.ReadyToServeNotificationInIANDTO;
import com.resteam.smartway.service.mapper.base.EntityMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ReadyToServeNotificationInIANMapper extends EntityMapper<ReadyToServeNotificationInIANDTO, ReadyToServeNotification> {}
