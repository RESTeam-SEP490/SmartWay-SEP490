package com.resteam.smartway.web.rest;

import com.resteam.smartway.service.MenuItemCategoryService;
import com.resteam.smartway.service.dto.MenuItemCategoryDTO;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;

@Log4j2
@RestController
@RequestMapping("/api/npm start" + "")
@Transactional
@RequiredArgsConstructor
public class MenuItemCategoryResource {

    private static final String ENTITY_NAME = "menuItemCategory";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MenuItemCategoryService menuItemCategoryService;

    @GetMapping
    public ResponseEntity<List<MenuItemCategoryDTO>> loadMenuItemCategories() {
        List<MenuItemCategoryDTO> menuItemCategoryList = menuItemCategoryService.loadAllMenuItemCategories();
        return ResponseEntity.ok(menuItemCategoryList);
    }

    @PostMapping
    public ResponseEntity<MenuItemCategoryDTO> createMenuItem(@Valid @RequestBody MenuItemCategoryDTO menuItemCategoryDTO) {
        if (menuItemCategoryDTO.getId() != null) {
            throw new BadRequestAlertException("A new entity cannot already have an ID", ENTITY_NAME, "id_exist");
        }
        MenuItemCategoryDTO result = menuItemCategoryService.createMenuItemCategory(menuItemCategoryDTO);
        return ResponseEntity
            .created(URI.create(result.getId().toString()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuItemCategoryDTO> updateRestaurant(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody MenuItemCategoryDTO menuItemCategoryDTO
    ) {
        if (menuItemCategoryDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, menuItemCategoryDTO.getId().toString())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        MenuItemCategoryDTO result = menuItemCategoryService.updateMenuItemCategory(menuItemCategoryDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable("id") String id) {
        if (id == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        menuItemCategoryService.deleteMenuItemCategory(UUID.fromString(id));
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
