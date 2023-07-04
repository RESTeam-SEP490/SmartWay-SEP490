package com.resteam.smartway.service.mapper;

import com.resteam.smartway.domain.User;
import com.resteam.smartway.service.dto.TenantRegistrationDTO;
import com.resteam.smartway.service.mapper.base.EntityMapper;
import org.mapstruct.Mapper;

@Mapper
public interface TenantRegistrationMapper extends EntityMapper<TenantRegistrationDTO, User> {
    User toEntity(TenantRegistrationDTO dto);

    TenantRegistrationDTO toDto(User entity);
}
