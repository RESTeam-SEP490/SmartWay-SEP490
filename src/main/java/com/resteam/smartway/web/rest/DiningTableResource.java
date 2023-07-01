package com.resteam.smartway.web.rest;

import com.resteam.smartway.service.DiningTableService;
import com.resteam.smartway.service.MenuItemService;
import com.resteam.smartway.service.dto.DiningTableDTO;
import com.resteam.smartway.service.dto.MenuItemDTO;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import javax.servlet.http.HttpServletRequest;
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
@RequestMapping("/api/dining_tables")
@Transactional
@RequiredArgsConstructor
public class DiningTableResource {

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private static final String ENTITY_NAME = "menuItem";

    private final DiningTableService diningTableService;

    @GetMapping
    public ResponseEntity<List<DiningTableDTO>> loadDiningTableWithSearch(
        Pageable pageable,
        @RequestParam(value = "search", required = false) String searchText,
        @RequestParam(value = "zoneIds", required = false) List<String> zoneIds
    ) {
        Page<DiningTableDTO> diningTablePage = diningTableService.loadDiningTablesWithSearch(pageable, searchText, zoneIds);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(
            ServletUriComponentsBuilder.fromCurrentRequest(),
            diningTablePage
        );
        return new ResponseEntity<>(diningTablePage.getContent(), headers, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<DiningTableDTO> createDiningTable(@Valid @RequestPart DiningTableDTO diningTableDTO) {
        if (diningTableDTO.getId() != null) {
            throw new BadRequestAlertException("A new entity cannot already have an ID", ENTITY_NAME, "id_exist");
        }
        DiningTableDTO result = diningTableService.createDiningTable(diningTableDTO);
        return ResponseEntity
            .created(URI.create(result.getId().toString()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(diningTableDTO);
    }

    @PutMapping("/{id}")
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
}
