package com.resteam.smartway.service;

import com.resteam.smartway.domain.MenuItemCategory;
import com.resteam.smartway.service.dto.MenuItemCategoryDTO;
import java.util.List;
import lombok.SneakyThrows;
import org.springframework.web.bind.annotation.RequestBody;

public interface MenuItemCategoryService {
    List<MenuItemCategory> loadAllMenuItemCategories();

    @SneakyThrows
    void createMenuItemCategory(@RequestBody MenuItemCategoryDTO menuItemCategoryDTO);
}
