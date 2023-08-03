package com.resteam.smartway.service.mapper.order;

import com.resteam.smartway.domain.order.OrderDetail;
import com.resteam.smartway.service.dto.order.OrderDetailDTO;
import com.resteam.smartway.service.mapper.MenuItemMapper;
import com.resteam.smartway.service.mapper.base.EntityMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = { MenuItemMapper.class, HasReadyToServeItemMapper.class })
public interface OrderDetailMapper extends EntityMapper<OrderDetailDTO, OrderDetail> {
    OrderDetail toEntity(OrderDetailDTO dto);

    @Mapping(target = "hasReadyToServeItem", source = "itemAdditionNotificationList")
    OrderDetailDTO toDto(OrderDetail entity);
}
