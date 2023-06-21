package com.resteam.smartway.web.rest;

import com.resteam.smartway.domain.MenuItemCategory;
import com.resteam.smartway.service.MenuItemCategoryService;
import com.resteam.smartway.service.dto.MenuItemCategoryDTO;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@Log4j2
@RestController
@RequestMapping("/api/menu-item-categories")
@Transactional
@AllArgsConstructor
public class MenuItemCategoryResource {

    private static final String ENTITY_NAME = "menu_item_category";

    private final MenuItemCategoryService menuItemCategoryService;

    @GetMapping
    public ResponseEntity<List<MenuItemCategory>> loadMenuItemCategories() {
        List<MenuItemCategory> menuItemCategoryList = menuItemCategoryService.loadAllMenuItemCategories();
        return ResponseEntity.ok(menuItemCategoryList);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createMenuItem(@RequestBody MenuItemCategoryDTO menuItemCategoryDTO) {
        if (menuItemCategoryDTO.getId() != null) {
            throw new BadRequestAlertException("A new entity cannot already have an ID", ENTITY_NAME, "id_exist");
        }
        menuItemCategoryService.createMenuItemCategory(menuItemCategoryDTO);
    }
}
