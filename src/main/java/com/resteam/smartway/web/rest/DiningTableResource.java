package com.resteam.smartway.web.rest;

import com.resteam.smartway.service.DiningTableService;
import com.resteam.smartway.service.dto.DiningTableDTO;
import com.resteam.smartway.service.dto.IsActiveUpdateDTO;
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
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;

@Log4j2
@RestController
@RequestMapping("/api/dining_tables")
@Transactional
@RequiredArgsConstructor
public class DiningTableResource {

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private static final String ENTITY_NAME = "diningTable";

    private final DiningTableService diningTableService;

    @GetMapping
    @PostAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERMISSION_TABLE_VIEW')")
    public ResponseEntity<List<DiningTableDTO>> loadDiningTableWithSearch(
        Pageable pageable,
        @RequestParam(value = "search", required = false) String searchText,
        @RequestParam(value = "zoneIds", required = false) List<String> zoneIds,
        @RequestParam(value = "isActive", required = false) Boolean isActive
    ) {
        Page<DiningTableDTO> diningTablePage = diningTableService.loadDiningTablesWithSearch(pageable, searchText, zoneIds, isActive);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(
            ServletUriComponentsBuilder.fromCurrentRequest(),
            diningTablePage
        );
        return new ResponseEntity<>(diningTablePage.getContent(), headers, HttpStatus.OK);
    }

    @PostMapping
    @PostAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERMISSION_TABLE_CREATE')")
    public ResponseEntity<DiningTableDTO> createDiningTable(@Valid @RequestBody DiningTableDTO diningTableDTO) {
        if (diningTableDTO.getId() != null) {
            throw new BadRequestAlertException("A new entity cannot already have an ID", ENTITY_NAME, "id_exist");
        }
        DiningTableDTO result = diningTableService.createDiningTable(diningTableDTO);
        return ResponseEntity
            .created(URI.create(result.getId().toString()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PutMapping("/{id}")
    @PostAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERMISSION_TABLE_EDIT')")
    public ResponseEntity<DiningTableDTO> updateRestaurant(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestPart DiningTableDTO diningTableDTO
    ) {
        if (diningTableDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, diningTableDTO.getId().toString())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        DiningTableDTO result = diningTableService.updateDiningTable(diningTableDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PutMapping
    @PostAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERMISSION_TABLE_EDIT')")
    public ResponseEntity<DiningTableDTO> updateRestaurant(@Valid @RequestBody IsActiveUpdateDTO isActiveUpdateDTO) {
        diningTableService.updateIsActiveDiningTables(isActiveUpdateDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, isActiveUpdateDTO.getIds().toString()))
            .build();
    }

    @DeleteMapping
    @PostAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERMISSION_TABLE_DELETE')")
    public ResponseEntity<Void> deleteRestaurants(@RequestParam(value = "ids") final List<String> ids) {
        diningTableService.deleteDiningTable(ids);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, String.valueOf(ids)))
            .build();
    }
}
