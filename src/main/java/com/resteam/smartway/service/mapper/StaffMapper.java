package com.resteam.smartway.service.mapper;

import com.resteam.smartway.domain.User;
import com.resteam.smartway.service.dto.StaffDTO;
import com.resteam.smartway.service.mapper.base.EntityMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = { RoleMapper.class })
public interface StaffMapper extends EntityMapper<StaffDTO, User> {
    User toEntity(StaffDTO dto);

    StaffDTO toDto(User entity);
}
