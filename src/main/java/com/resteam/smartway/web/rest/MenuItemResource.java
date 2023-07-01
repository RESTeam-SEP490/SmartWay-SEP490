package com.resteam.smartway.web.rest;

import com.resteam.smartway.service.MenuItemService;
import com.resteam.smartway.service.dto.MenuItemDTO;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.util.List;
import java.util.Objects;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;

@Log4j2
@RestController
@RequestMapping("/api/menu-items")
@Transactional
@RequiredArgsConstructor
public class MenuItemResource {

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private static final String ENTITY_NAME = "menuItem";

    private final MenuItemService menuItemService;

    @GetMapping
    public ResponseEntity<List<MenuItemDTO>> loadMenuItemWithSearch(
        Pageable pageable,
        @RequestParam(value = "search", required = false) String searchText,
        @RequestParam(value = "categoryIds", required = false) List<String> categoryIds
    ) {
        Page<MenuItemDTO> menuItemPage = menuItemService.loadMenuItemsWithSearch(pageable, searchText, categoryIds);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), menuItemPage);
        return new ResponseEntity<>(menuItemPage.getContent(), headers, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<MenuItemDTO> createMenuItem(
        @Valid @RequestPart MenuItemDTO menuItemDTO,
        @RequestPart(required = false) MultipartFile imageSource
    ) {
        if (menuItemDTO.getId() != null) {
            throw new BadRequestAlertException("A new entity cannot already have an ID", ENTITY_NAME, "id_exist");
        }
        MenuItemDTO result = menuItemService.createMenuItem(menuItemDTO, imageSource);
        return ResponseEntity
            .created(URI.create(result.getId().toString()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(menuItemDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuItemDTO> updateRestaurant(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestPart MenuItemDTO menuItemDTO,
        @RequestPart(required = false) MultipartFile imageSource
    ) {
        if (menuItemDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, menuItemDTO.getId().toString())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        MenuItemDTO result = menuItemService.updateMenuItem(menuItemDTO, imageSource);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }
}
