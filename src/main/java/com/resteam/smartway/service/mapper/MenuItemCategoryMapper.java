package com.resteam.smartway.service.mapper;

import com.resteam.smartway.domain.MenuItem;
import com.resteam.smartway.domain.MenuItemCategory;
import com.resteam.smartway.service.dto.MenuItemCategoryDTO;
import com.resteam.smartway.service.dto.MenuItemDTO;
import com.resteam.smartway.service.mapper.base.EntityMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MenuItemCategoryMapper extends EntityMapper<MenuItemCategoryDTO, MenuItemCategory> {}
