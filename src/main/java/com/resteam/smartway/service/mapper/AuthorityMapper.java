package com.resteam.smartway.service.mapper;

import com.resteam.smartway.domain.Authority;
import com.resteam.smartway.domain.MenuItem;
import com.resteam.smartway.service.dto.MenuItemDTO;
import com.resteam.smartway.service.mapper.base.EntityMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class AuthorityMapper {

    Authority toEntity(String dto) {
        return new Authority(dto);
    }

    @Mapping(source = "name", target = "value")
    String toDto(Authority entity) {
        return entity.getName();
    }
}
