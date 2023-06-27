package com.resteam.smartway.web.rest;

import com.resteam.smartway.domain.MenuItemCategory;
import com.resteam.smartway.service.MenuItemCategoryService;
import com.resteam.smartway.service.dto.MenuItemCategoryDTO;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;

@Log4j2
@RestController
@RequestMapping("/api/menu-item-categories")
@Transactional
@RequiredArgsConstructor
public class MenuItemCategoryResource {

    private static final String ENTITY_NAME = "menuItemCategory";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MenuItemCategoryService menuItemCategoryService;

    @GetMapping
    public ResponseEntity<List<MenuItemCategory>> loadMenuItemCategories() {
        List<MenuItemCategory> menuItemCategoryList = menuItemCategoryService.loadAllMenuItemCategories();
        return ResponseEntity.ok(menuItemCategoryList);
    }

    @PostMapping
    public ResponseEntity<Void> createMenuItem(@RequestBody MenuItemCategoryDTO menuItemCategoryDTO) {
        if (menuItemCategoryDTO.getId() != null) {
            throw new BadRequestAlertException("A new entity cannot already have an ID", ENTITY_NAME, "id_exist");
        }
        MenuItemCategory menuItemCategory = menuItemCategoryService.createMenuItemCategory(menuItemCategoryDTO);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, menuItemCategory.getId().toString()))
            .build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable String id) {
        log.debug("REST request to delete Restaurant : {}", id);
        menuItemCategoryService.deleteMenuItemCategory(UUID.fromString(id));
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
