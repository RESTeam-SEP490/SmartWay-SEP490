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
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    @Override
    public List<MenuItemCategoryDTO> loadAllMenuItemCategories() {
        String restaurantId = SecurityUtils.getCurrentRestaurantId().orElseThrow(RestaurantInfoNotFoundException::new);

        List<MenuItemCategory> menuItemCategoryList = menuItemCategoryRepository.findAllByRestaurantOrderByCreatedDateDesc(
            new Restaurant(restaurantId)
        );
        return menuItemCategoryMapper.toDto(menuItemCategoryList);
    }

    @Override
    @SneakyThrows
    public MenuItemCategoryDTO createMenuItemCategory(MenuItemCategoryDTO menuItemCategoryDTO) {
        String restaurantId = SecurityUtils.getCurrentRestaurantId().orElseThrow(RestaurantInfoNotFoundException::new);

        menuItemCategoryRepository
            .findOneByRestaurantAndName(new Restaurant(restaurantId), menuItemCategoryDTO.getName())
            .ifPresent(m -> {
                throw new BadRequestAlertException(applicationName, ENTITY_NAME, "existed");
            });

        MenuItemCategory menuItemCategory = menuItemCategoryMapper.toEntity(menuItemCategoryDTO);
        menuItemCategory.setRestaurant(new Restaurant(restaurantId));

        return menuItemCategoryMapper.toDto(menuItemCategoryRepository.save(menuItemCategory));
    }

    @Override
    public MenuItemCategoryDTO updateMenuItemCategory(MenuItemCategoryDTO menuItemCategoryDTO) {
        String restaurantId = SecurityUtils.getCurrentRestaurantId().orElseThrow(RestaurantInfoNotFoundException::new);

        MenuItemCategory menuItemCategory = menuItemCategoryRepository
            .findByRestaurantAndId(new Restaurant(restaurantId), menuItemCategoryDTO.getId())
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));

        menuItemCategory.setName(menuItemCategoryDTO.getName());
        MenuItemCategory result = menuItemCategoryRepository.save(menuItemCategory);

        return menuItemCategoryMapper.toDto(result);
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
}
