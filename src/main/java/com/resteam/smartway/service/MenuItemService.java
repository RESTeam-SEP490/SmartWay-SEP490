package com.resteam.smartway.service;

import com.resteam.smartway.service.dto.IsActiveUpdateDTO;
import com.resteam.smartway.service.dto.MenuItemDTO;
import java.util.List;
import lombok.SneakyThrows;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface MenuItemService {
    Page<MenuItemDTO> loadMenuItemsWithSearch(Pageable pageable, String searchText, List<String> categoryIds, Boolean isActive);

    @SneakyThrows
    MenuItemDTO createMenuItem(MenuItemDTO menuItemDTO, MultipartFile imageSource);

    MenuItemDTO updateMenuItem(MenuItemDTO menuItemDTO, MultipartFile imageSource);

    void deleteMenuItem(List<String> ids);

    void updateIsActiveMenuItems(IsActiveUpdateDTO isActiveUpdateDTO);
}
