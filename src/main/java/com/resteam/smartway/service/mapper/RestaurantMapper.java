package com.resteam.smartway.service.mapper;

import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.service.dto.RestaurantDTO;
import com.resteam.smartway.service.mapper.base.EntityMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RestaurantMapper extends EntityMapper<RestaurantDTO, Restaurant> {
    Restaurant toEntity(RestaurantDTO dto);

    RestaurantDTO toDto(Restaurant entity);
}
