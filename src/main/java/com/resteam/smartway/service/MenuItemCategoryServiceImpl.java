package com.resteam.smartway.service;

import com.resteam.smartway.domain.MenuItemCategory;
import com.resteam.smartway.repository.MenuItemCategoryRepository;
import com.resteam.smartway.service.dto.MenuItemCategoryDTO;
import com.resteam.smartway.service.mapper.MenuItemCategoryMapper;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.util.List;
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
        List<MenuItemCategory> menuItemCategoryList = menuItemCategoryRepository.findAllByOrderByCreatedDateDesc();
        return menuItemCategoryMapper.toDto(menuItemCategoryList);
    }

    @Override
    @SneakyThrows
    public MenuItemCategoryDTO createMenuItemCategory(MenuItemCategoryDTO menuItemCategoryDTO) {
        menuItemCategoryRepository
            .findOneByName(menuItemCategoryDTO.getName())
            .ifPresent(m -> {
                throw new BadRequestAlertException(applicationName, ENTITY_NAME, "existed");
            });

        MenuItemCategory menuItemCategory = menuItemCategoryMapper.toEntity(menuItemCategoryDTO);

        return menuItemCategoryMapper.toDto(menuItemCategoryRepository.save(menuItemCategory));
    }

    @Override
    public MenuItemCategoryDTO updateMenuItemCategory(MenuItemCategoryDTO menuItemCategoryDTO) {
        MenuItemCategory menuItemCategory = menuItemCategoryRepository
            .findById(menuItemCategoryDTO.getId())
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));

        menuItemCategory.setName(menuItemCategoryDTO.getName());
        MenuItemCategory result = menuItemCategoryRepository.save(menuItemCategory);

        return menuItemCategoryMapper.toDto(result);
    }

    @Override
    public void deleteMenuItemCategory(UUID id) {
        menuItemCategoryRepository.findById(id).ifPresent(menuItemCategoryRepository::delete);
    }

    @Override
    public MenuItemCategory loadMenuItemCategoryByName(String name) {
        return menuItemCategoryRepository.findByName(name);
    }
}
