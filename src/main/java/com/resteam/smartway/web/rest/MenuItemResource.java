package com.resteam.smartway.web.rest;

import com.resteam.smartway.service.MenuItemService;
import com.resteam.smartway.service.TemplateService;
import com.resteam.smartway.service.dto.IsActiveUpdateDTO;
import com.resteam.smartway.service.dto.MenuItemDTO;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.URI;
import java.util.*;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final TemplateService templateService;
    private final String PATH_TEMPLATE_EXCEL_MENU_ITEM = "templates/excel/Menu-Item.xlsx";
    private final String FILE_NAME_MENU_ITEM = "Menu-Item.xlsx";
    private final String MEDIA_TYPE = "application/vnd.ms-excel";

    private final String CONTENT_KEY_FILE_INVALID = "menuItem.fileInvalid";

    private final String CONTENT_KEY_UPLOAD_MENU_ITEM = "menuItem.upload";

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERMISSION_MENUITEM', 'PERMISSION_ORDER_ADD_AND_CANCEL')")
    public ResponseEntity<List<MenuItemDTO>> loadMenuItemWithSearch(
        Pageable pageable,
        @RequestParam(value = "search", required = false) String searchText,
        @RequestParam(value = "categoryIds", required = false) List<String> categoryIds,
        @RequestParam(value = "isActive", required = false) Boolean isActive
    ) {
        Page<MenuItemDTO> menuItemPage = menuItemService.loadMenuItemsWithSearch(pageable, searchText, categoryIds, isActive);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), menuItemPage);
        return new ResponseEntity<>(menuItemPage.getContent(), headers, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERMISSION_MENUITEM')")
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
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERMISSION_MENUITEM')")
    public ResponseEntity<MenuItemDTO> updateRestaurant(
        @PathVariable(value = "id") final String id,
        @Valid @RequestPart MenuItemDTO menuItemDTO,
        @RequestPart(required = false) MultipartFile imageSource
    ) {
        if (menuItemDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, menuItemDTO.getId().toString())) {
            throw new BadRequestAlertException("Invalid Id", ENTITY_NAME, "idinvalid");
        }

        MenuItemDTO result = menuItemService.updateMenuItem(menuItemDTO, imageSource);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PutMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERMISSION_MENUITEM')")
    public ResponseEntity<MenuItemDTO> updateRestaurant(@Valid @RequestBody IsActiveUpdateDTO isActiveUpdateDTO) {
        menuItemService.updateIsActiveMenuItems(isActiveUpdateDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, isActiveUpdateDTO.getIds().toString()))
            .build();
    }

    @DeleteMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERMISSION_MENUITEM')")
    public ResponseEntity<Void> deleteRestaurants(@RequestParam(value = "ids") final List<String> ids) {
        menuItemService.deleteMenuItem(ids);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, String.valueOf(ids)))
            .build();
    }

    @GetMapping("/download-template")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERMISSION_MENUITEM')")
    public ResponseEntity<InputStreamResource> downloadExcel() {
        ByteArrayInputStream stream = templateService.downloadExcelTemplate(PATH_TEMPLATE_EXCEL_MENU_ITEM, 2);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + FILE_NAME_MENU_ITEM);
        return ResponseEntity.ok().headers(headers).contentType(MediaType.parseMediaType(MEDIA_TYPE)).body(new InputStreamResource(stream));
    }

    @PostMapping("/import-menu-item")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERMISSION_MENUITEM')")
    public ResponseEntity<?> uploadMenuItemList(@RequestParam("file") MultipartFile file) throws IOException {
        if (templateService.checkTypeFile(file)) {
            Map<String, String> errorMap = menuItemService.importMenuItems(file.getInputStream());
            if (errorMap.isEmpty()) {
                return ResponseEntity.ok(CONTENT_KEY_UPLOAD_MENU_ITEM);
            } else {
                List<Map<String, String>> errorList = new ArrayList<>();
                for (Map.Entry<String, String> entry : errorMap.entrySet()) {
                    Map<String, String> error = new HashMap<>();
                    error.put("errorKey", entry.getKey());
                    error.put("contentKey", entry.getValue());
                    errorList.add(error);
                }
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorList);
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(CONTENT_KEY_FILE_INVALID);
        }
    }
}
