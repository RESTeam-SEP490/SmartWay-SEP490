package com.resteam.smartway.service;

import com.resteam.smartway.domain.MenuItem;
import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.repository.MenuItemRepository;
import com.resteam.smartway.security.SecurityUtils;
import com.resteam.smartway.service.aws.S3Service;
import com.resteam.smartway.service.dto.MenuItemDTO;
import com.resteam.smartway.service.mapper.MenuItemMapper;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import com.resteam.smartway.web.rest.errors.RestaurantInfoNotFoundException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class MenuItemServiceImpl implements MenuItemService {

    private static final String ENTITY_NAME = "menu_item";

    private final MenuItemRepository menuItemRepository;

    private final S3Service s3Service;

    private final MenuItemMapper menuItemMapper;

    @Override
    public Page<MenuItemDTO> loadMenuItemsWithSearch(Pageable pageable, String searchText, List<String> categoryIds) {
        String restaurantId = SecurityUtils.getCurrentRestaurantId().orElseThrow(RestaurantInfoNotFoundException::new);
        if (searchText != null) searchText = searchText.toLowerCase();
        List<UUID> categoryUuidList = null;
        if (categoryIds != null && categoryIds.size() > 0) categoryUuidList =
            categoryIds.stream().map(c -> UUID.fromString(c)).collect(Collectors.toList());
        Page<MenuItem> menuItemPage = menuItemRepository.findWithFilterParams(restaurantId, searchText, categoryUuidList, pageable);

        return menuItemPage.map(item -> {
            MenuItemDTO menuItem = menuItemMapper.toDto(item);
            if (item.getImageKey() != null) {
                String imageUrl = s3Service.getUploadUrl(item.getImageKey());
                menuItem.setImageUrl(imageUrl);
            } else menuItem.setImageUrl("");
            return menuItem;
        });
    }

    @Override
    @SneakyThrows
    public MenuItemDTO createMenuItem(@Valid MenuItemDTO menuItemDTO, MultipartFile imageSource) {
        String restaurantId = SecurityUtils.getCurrentRestaurantId().orElseThrow(RestaurantInfoNotFoundException::new);

        MenuItem menuItem = menuItemMapper.toEntity(menuItemDTO);
        String menuItemCode = generateCode(restaurantId);

        if (imageSource != null) {
            String path = String.format("%s/menu-items/%s", restaurantId, menuItemCode);
            s3Service.uploadImage(imageSource, path);
            menuItem.setImageKey(path);
        }
        menuItem.setCode(menuItemCode);
        menuItem.setRestaurant(new Restaurant(restaurantId));

        return menuItemMapper.toDto(menuItemRepository.save(menuItem));
    }

    private String generateCode(String restaurantId) {
        Optional<MenuItem> lastMenuItem = menuItemRepository.findTopByRestaurantOrderByCodeDesc(new Restaurant(restaurantId));

        if (lastMenuItem.isEmpty()) return "MI000001"; else {
            String lastCode = lastMenuItem.get().getCode();
            int nextCodeInt = Integer.parseInt(lastCode.substring(2)) + 1;
            if (nextCodeInt > 999999) throw new IllegalStateException("Maximum Code reached");
            return String.format("MI%06d", nextCodeInt);
        }
    }

    @Override
    @SneakyThrows
    public MenuItemDTO updateMenuItem(MenuItemDTO menuItemDTO, MultipartFile imageSource) {
        String restaurantId = SecurityUtils.getCurrentRestaurantId().orElseThrow(RestaurantInfoNotFoundException::new);

        MenuItem menuItem = menuItemRepository
            .findByIdAndRestaurant(menuItemDTO.getId(), new Restaurant(restaurantId))
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));

        if (imageSource != null) {
            if (menuItem.getImageKey() != null) {
                s3Service.deleteFile(menuItem.getImageKey());
                s3Service.uploadImage(imageSource, menuItem.getImageKey());
            } else {
                String path = String.format("%s/menu-items/%s", restaurantId, menuItem.getCode());
                s3Service.uploadImage(imageSource, path);
                menuItem.setImageKey(path);
            }
        }

        menuItemMapper.partialUpdate(menuItem, menuItemDTO);
        if (menuItemDTO.getImageUrl() == null || menuItemDTO.getImageUrl().isEmpty()) {
            s3Service.deleteFile(menuItem.getImageKey());
            menuItem.setImageKey(null);
        }

        MenuItem result = menuItemRepository.save(menuItem);
        return menuItemMapper.toDto(result);
    }
}
