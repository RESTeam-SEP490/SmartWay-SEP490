package com.resteam.smartway.service.mapper;

import com.resteam.smartway.domain.Role;
import com.resteam.smartway.service.dto.RoleDTO;
import com.resteam.smartway.service.mapper.base.EntityMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = { AuthorityMapper.class })
public interface RoleMapper extends EntityMapper<RoleDTO, Role> {
    Role toEntity(RoleDTO dto);

    RoleDTO toDto(Role entity);
}
