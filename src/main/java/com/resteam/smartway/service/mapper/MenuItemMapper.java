package com.resteam.smartway.service.mapper;

import com.resteam.smartway.domain.MenuItem;
import com.resteam.smartway.domain.User;
import com.resteam.smartway.service.dto.MenuItemDTO;
import com.resteam.smartway.service.dto.TenantRegistrationDTO;
import com.resteam.smartway.service.mapper.base.EntityMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = { MenuItemCategoryMapper.class })
public interface MenuItemMapper extends EntityMapper<MenuItemDTO, MenuItem> {
    @Mapping(target = "menuItemCategory.id", source = "menuItemCategoryId")
    MenuItem toEntity(MenuItemDTO dto);

    @Mapping(target = "menuItemCategoryId", source = "menuItemCategory.id")
    MenuItemDTO toDto(MenuItem entity);
}
