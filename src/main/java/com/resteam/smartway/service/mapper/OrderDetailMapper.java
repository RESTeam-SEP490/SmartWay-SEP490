package com.resteam.smartway.service.mapper;

import com.resteam.smartway.domain.OrderDetail;
import com.resteam.smartway.service.dto.OrderDetailDTO;
import com.resteam.smartway.service.mapper.base.EntityMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = { MenuItemMapper.class })
public interface OrderDetailMapper extends EntityMapper<OrderDetailDTO, OrderDetail> {
    @Mapping(target = "swOrder.id", source = "orderId")
    OrderDetail toEntity(OrderDetailDTO dto);

    @Mapping(target = "orderId", source = "swOrder.id")
    OrderDetailDTO toDto(OrderDetail entity);
}
