package com.resteam.smartway.service.mapper;

import com.resteam.smartway.domain.OrderDetail;
import com.resteam.smartway.service.dto.OrderDetailDTO;
import com.resteam.smartway.service.mapper.base.EntityMapper;
import java.util.List;
import java.util.stream.Collectors;

public interface OrderDetailMapper extends EntityMapper<OrderDetailDTO, OrderDetail> {
    OrderDetailDTO toDto(OrderDetail entity);

    OrderDetail toEntity(OrderDetailDTO dto);

    default List<OrderDetailDTO> toDtoList(List<OrderDetail> entities) {
        return entities.stream().map(this::toDto).collect(Collectors.toList());
    }

    default List<OrderDetail> toEntityList(List<OrderDetailDTO> dtos) {
        return dtos.stream().map(this::toEntity).collect(Collectors.toList());
    }
}
