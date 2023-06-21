package com.resteam.smartway.service;

import com.resteam.smartway.domain.MenuItem;
import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.repository.MenuItemRepository;
import com.resteam.smartway.security.SecurityUtils;
import com.resteam.smartway.service.aws.S3Service;
import com.resteam.smartway.service.dto.MenuItemDTO;
import com.resteam.smartway.service.mapper.MenuItemMapper;
import com.resteam.smartway.web.rest.errors.RestaurantInfoNotFoundException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class MenuItemServiceImpl implements MenuItemService {

    private final MenuItemRepository menuItemRepository;

    private final S3Service s3Service;

    private final MenuItemMapper menuItemMapper;

    @Override
    public Page<MenuItem> loadMenuItemsWithSearch(Pageable pageable, String searchText, String categoryId) {
        String restaurantId = SecurityUtils.getCurrentRestaurantId().orElseThrow(RestaurantInfoNotFoundException::new);
        if (searchText != null) searchText = searchText.toLowerCase();
        UUID categoryUuid = null;
        if (categoryId != null) categoryUuid = UUID.fromString(categoryId);
        return menuItemRepository.findWithFilterParams(restaurantId, searchText, categoryUuid, pageable);
    }

    @Override
    @SneakyThrows
    public void createMenuItem(MenuItemDTO menuItemDTO) {
        String restaurantId = SecurityUtils.getCurrentRestaurantId().orElseThrow(RestaurantInfoNotFoundException::new);

        String path = String.format("%s/menu-items/", restaurantId);
        String imageKey = s3Service.uploadImage(menuItemDTO.getImageSource(), path);

        MenuItem menuItem = menuItemMapper.toEntity(menuItemDTO);
        menuItem.setImageKey(imageKey);
        menuItem.setRestaurant(new Restaurant(restaurantId));

        menuItemRepository.save(menuItem);
    }
}
