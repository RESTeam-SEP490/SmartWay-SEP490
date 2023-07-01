package com.resteam.smartway.service;

import com.resteam.smartway.service.dto.MenuItemDTO;
import java.util.List;
import lombok.SneakyThrows;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface MenuItemService {
    Page<MenuItemDTO> loadMenuItemsWithSearch(Pageable pageable, String searchText, List<String> categoryIds);

    @SneakyThrows
    MenuItemDTO createMenuItem(MenuItemDTO menuItemDTO, MultipartFile imageSource);

    MenuItemDTO updateMenuItem(MenuItemDTO menuItemDTO, MultipartFile imageSource);
}
