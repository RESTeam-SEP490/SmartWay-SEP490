package com.resteam.smartway.web.rest;

import com.resteam.smartway.service.MenuItemService;
import com.resteam.smartway.service.dto.MenuItemDTO;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.util.List;
import javax.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
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
    @ResponseStatus(HttpStatus.CREATED)
    public void createMenuItem(@Valid @RequestPart MenuItemDTO menuItemDTO, @RequestPart(required = false) MultipartFile imageSource) {
        //        try {
        ////            menuItemDTO = new ObjectMapper().readValue(json, MenuItemDTO.class);
        //        } catch (JacksonException e) {
        //            throw new BadRequestAlertException("Json string of entity is not true", ENTITY_NAME, "json_failed");
        //        }
        if (menuItemDTO.getId() != null) {
            throw new BadRequestAlertException("A new entity cannot already have an ID", ENTITY_NAME, "id_exist");
        }
        menuItemService.createMenuItem(menuItemDTO, imageSource);
    }
}
