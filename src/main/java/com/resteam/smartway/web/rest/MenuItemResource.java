package com.resteam.smartway.web.rest;

import com.resteam.smartway.domain.MenuItem;
import com.resteam.smartway.service.MenuItemService;
import com.resteam.smartway.service.dto.MenuItemDTO;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.PaginationUtil;

@Log4j2
@RestController
@RequestMapping("/api/menu-items")
@Transactional
@AllArgsConstructor
public class MenuItemResource {

    private static final String ENTITY_NAME = "menu_item";

    private final MenuItemService menuItemService;

    @GetMapping
    public ResponseEntity<List<MenuItem>> loadMenuItemWithSearch(
        Pageable pageable,
        @RequestParam(value = "search", required = false) String searchText,
        @RequestParam(value = "categoryId", required = false) String categoryId
    ) {
        Page<MenuItem> menuItemPage = menuItemService.loadMenuItemsWithSearch(pageable, searchText, categoryId);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), menuItemPage);
        return new ResponseEntity<>(menuItemPage.getContent(), headers, HttpStatus.OK);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createMenuItem(@ModelAttribute MenuItemDTO menuItemDTO) {
        if (menuItemDTO.getId() != null) {
            throw new BadRequestAlertException("A new entity cannot already have an ID", ENTITY_NAME, "id_exist");
        }
        menuItemService.createMenuItem(menuItemDTO);
    }
}
