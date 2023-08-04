package com.resteam.smartway.service.mapper.order;

import com.resteam.smartway.domain.order.SwOrder;
import com.resteam.smartway.service.dto.order.OrderDTO;
import com.resteam.smartway.service.mapper.DiningTableMapper;
import com.resteam.smartway.service.mapper.base.EntityMapper;
import com.resteam.smartway.service.mapper.order.OrderDetailMapper;
import com.resteam.smartway.service.mapper.order.notification.KitchenNotificationHistoryMapper;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring", uses = { OrderDetailMapper.class, DiningTableMapper.class, KitchenNotificationHistoryMapper.class })
public interface OrderMapper extends EntityMapper<OrderDTO, SwOrder> {}
