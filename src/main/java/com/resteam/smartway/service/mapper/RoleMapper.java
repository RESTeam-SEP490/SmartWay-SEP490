package com.resteam.smartway.service.mapper;

import com.resteam.smartway.domain.Role;
import com.resteam.smartway.service.dto.RoleDTO;
import com.resteam.smartway.service.mapper.base.EntityMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoleMapper extends EntityMapper<RoleDTO, Role> {}
