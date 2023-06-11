package com.resteam.smartway.service.mapper;

import com.resteam.smartway.domain.User;
import com.resteam.smartway.service.dto.TenantRegistrationDTO;
import com.resteam.smartway.service.mapper.base.EntityMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper
public interface TenantRegistrationMapper extends EntityMapper<TenantRegistrationDTO, User> {
    @Mapping(target = "restaurant.name", source = "restaurantName")
    User toEntity(TenantRegistrationDTO dto);

    @Mapping(target = "restaurantName", source = "restaurant.name")
    TenantRegistrationDTO toDto(User entity);
}
