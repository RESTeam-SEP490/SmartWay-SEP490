package com.resteam.smartway.service.mapper.order.notification;

import com.resteam.smartway.domain.order.notifications.KitchenNotificationHistory;
import com.resteam.smartway.service.dto.order.notification.KitchenNotificationHistoryDTO;
import com.resteam.smartway.service.mapper.base.EntityMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = { ItemAdditionNotificationMapper.class, ItemCancellationNotificationMapper.class })
public interface KitchenNotificationHistoryMapper extends EntityMapper<KitchenNotificationHistoryDTO, KitchenNotificationHistory> {}
