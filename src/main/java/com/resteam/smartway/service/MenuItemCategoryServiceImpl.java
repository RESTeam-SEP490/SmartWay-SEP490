package com.resteam.smartway.service;

import com.resteam.smartway.domain.MenuItemCategory;
import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.repository.MenuItemCategoryRepository;
import com.resteam.smartway.security.SecurityUtils;
import com.resteam.smartway.service.dto.MenuItemCategoryDTO;
import com.resteam.smartway.service.mapper.MenuItemCategoryMapper;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import com.resteam.smartway.web.rest.errors.RestaurantInfoNotFoundException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class MenuItemCategoryServiceImpl implements MenuItemCategoryService {

    private final MenuItemCategoryRepository menuItemCategoryRepository;

    private final MenuItemCategoryMapper menuItemCategoryMapper;

    private static final String ENTITY_NAME = "menuItemCategory";

    @Override
    public List<MenuItemCategory> loadAllMenuItemCategories() {
        String restaurantId = SecurityUtils.getCurrentRestaurantId().orElseThrow(RestaurantInfoNotFoundException::new);

        return menuItemCategoryRepository.findAllByRestaurantOrderByCreatedDate(new Restaurant(restaurantId));
    }

    @Override
    @SneakyThrows
    public MenuItemCategory createMenuItemCategory(MenuItemCategoryDTO menuItemCategoryDTO) {
        String restaurantId = SecurityUtils.getCurrentRestaurantId().orElseThrow(RestaurantInfoNotFoundException::new);

        MenuItemCategory menuItemCategory = menuItemCategoryMapper.toEntity(menuItemCategoryDTO);
        menuItemCategory.setRestaurant(new Restaurant(restaurantId));

        return menuItemCategoryRepository.save(menuItemCategory);
    }

    @Override
    public void deleteMenuItemCategory(UUID id) {
        String restaurantId = SecurityUtils.getCurrentRestaurantId().orElseThrow(RestaurantInfoNotFoundException::new);

        Optional<MenuItemCategory> menuItemCategory = menuItemCategoryRepository.findByRestaurantAndId(new Restaurant(restaurantId), id);
        if (menuItemCategory.isEmpty()) {
            throw new BadRequestAlertException("Menu item category not found", ENTITY_NAME, "entityNotFound");
        }
        menuItemCategoryRepository.delete(menuItemCategory.get());
    }

    @Override
    public MenuItemCategory loadMenuItemCategoryByName(String name) {
        return menuItemCategoryRepository.findByName(name);
    }
}
