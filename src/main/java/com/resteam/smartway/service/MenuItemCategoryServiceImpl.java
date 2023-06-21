package com.resteam.smartway.service;

import com.resteam.smartway.domain.MenuItemCategory;
import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.repository.MenuItemCategoryRepository;
import com.resteam.smartway.security.SecurityUtils;
import com.resteam.smartway.service.dto.MenuItemCategoryDTO;
import com.resteam.smartway.service.mapper.MenuItemCategoryMapper;
import com.resteam.smartway.web.rest.errors.RestaurantInfoNotFoundException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class MenuItemCategoryServiceImpl implements MenuItemCategoryService {

    private final MenuItemCategoryRepository menuItemCategoryRepository;

    private final MenuItemCategoryMapper menuItemCategoryMapper;

    @Override
    public List<MenuItemCategory> loadAllMenuItemCategories() {
        String restaurantId = SecurityUtils.getCurrentRestaurantId().orElseThrow(RestaurantInfoNotFoundException::new);

        return menuItemCategoryRepository.findAllByRestaurant(new Restaurant(restaurantId));
    }

    @Override
    @SneakyThrows
    public void createMenuItemCategory(MenuItemCategoryDTO menuItemCategoryDTO) {
        String restaurantId = SecurityUtils.getCurrentRestaurantId().orElseThrow(RestaurantInfoNotFoundException::new);

        MenuItemCategory menuItemCategory = menuItemCategoryMapper.toEntity(menuItemCategoryDTO);
        menuItemCategory.setRestaurant(new Restaurant(restaurantId));

        menuItemCategoryRepository.save(menuItemCategory);
    }
}
