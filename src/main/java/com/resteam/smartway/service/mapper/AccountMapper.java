package com.resteam.smartway.service.mapper;

import com.resteam.smartway.domain.User;
import com.resteam.smartway.service.dto.AdminUserDTO;
import com.resteam.smartway.service.mapper.base.EntityMapper;
import org.mapstruct.Mapper;

@Mapper
public interface AccountMapper extends EntityMapper<AdminUserDTO, User> {}
