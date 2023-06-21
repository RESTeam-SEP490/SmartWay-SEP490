package com.resteam.smartway.service;

import com.resteam.smartway.domain.MenuItem;
import com.resteam.smartway.service.dto.MenuItemDTO;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MenuItemService {
    Page<MenuItem> loadMenuItemsWithSearch(Pageable pageable, String searchText, String categoryId);

    void createMenuItem(MenuItemDTO menuItemDTO);
}
