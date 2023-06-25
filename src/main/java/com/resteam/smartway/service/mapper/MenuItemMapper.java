package com.resteam.smartway.service.mapper;

import com.resteam.smartway.domain.MenuItem;
import com.resteam.smartway.domain.User;
import com.resteam.smartway.service.dto.MenuItemDTO;
import com.resteam.smartway.service.dto.TenantRegistrationDTO;
import com.resteam.smartway.service.mapper.base.EntityMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = { MenuItemCategoryMapper.class, MenuItemMapper.class })
public interface MenuItemMapper extends EntityMapper<MenuItemDTO, MenuItem> {
    MenuItem toEntity(MenuItemDTO dto);

    MenuItemDTO toDto(MenuItem entity);
}
