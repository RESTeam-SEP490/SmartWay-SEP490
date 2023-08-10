package com.resteam.smartway.service;

import com.resteam.smartway.domain.MenuItemCategory;
import com.resteam.smartway.service.dto.MenuItemCategoryDTO;
import java.util.List;
import java.util.UUID;
import lombok.SneakyThrows;
import org.springframework.web.bind.annotation.RequestBody;

public interface MenuItemCategoryService {
    List<MenuItemCategoryDTO> loadAllMenuItemCategories();

    @SneakyThrows
    MenuItemCategoryDTO createMenuItemCategory(@RequestBody MenuItemCategoryDTO menuItemCategoryDTO);

    MenuItemCategoryDTO updateMenuItemCategory(MenuItemCategoryDTO menuItemCategoryDTO);

    void deleteMenuItemCategory(UUID id);

    MenuItemCategory loadMenuItemCategoryByName(String name);
}
