package com.resteam.smartway.web.rest;

import com.resteam.smartway.security.AuthoritiesConstants;
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
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize(
        "hasAnyAuthority('ROLE_ADMIN', 'PERMISSION_MENUITEM', 'PERMISSION_ORDER_ADD_AND_CANCEL', 'PERMISSION_KITCHEN_RTS_ITEM', 'PERMISSION_KITCHEN_PREPARING_ITEM')"
    )
    public ResponseEntity<List<MenuItemCategoryDTO>> loadMenuItemCategories() {
        List<MenuItemCategoryDTO> menuItemCategoryList = menuItemCategoryService.loadAllMenuItemCategories();
        return ResponseEntity.ok(menuItemCategoryList);
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERMISSION_MENUITEM')")
    public ResponseEntity<MenuItemCategoryDTO> createMenuItemCategory(@Valid @RequestBody MenuItemCategoryDTO menuItemCategoryDTO) {
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
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERMISSION_MENUITEM')")
    public ResponseEntity<MenuItemCategoryDTO> updateCategory(
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
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERMISSION_MENUITEM')")
    public ResponseEntity<Void> deleteCategory(@PathVariable("id") String id) {
        if (id == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        menuItemCategoryService.deleteMenuItemCategory(UUID.fromString(id));
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
