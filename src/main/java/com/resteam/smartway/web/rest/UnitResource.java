package com.resteam.smartway.web.rest;

import com.resteam.smartway.service.UnitService;
import com.resteam.smartway.service.dto.MenuItemCategoryDTO;
import com.resteam.smartway.service.dto.UnitDTO;
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
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;

@Log4j2
@RestController
@RequestMapping("/api/units")
@Transactional
@RequiredArgsConstructor
public class UnitResource {

    private static final String ENTITY_NAME = "unit";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UnitService unitService;

    @GetMapping
    @PostAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERMISSION_MENUITEM_VIEW')")
    public ResponseEntity<List<UnitDTO>> loadAllUnit() {
        List<UnitDTO> listUnit = unitService.loadAllUnit();
        return ResponseEntity.ok(listUnit);
    }

    @PutMapping("/{id}")
    @PostAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERMISSION_MENUITEM_UPDATE')")
    public ResponseEntity<UnitDTO> updateUnit(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody UnitDTO unitDTO
    ) {
        if (unitDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, unitDTO.getId().toString())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        UnitDTO result = unitService.updateUnit(unitDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PostMapping
    @PostAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERMISSION_MENUITEM_CREATE')")
    public ResponseEntity<UnitDTO> createUnit(@Valid @RequestBody UnitDTO unitDTO) {
        if (unitDTO.getId() != null) {
            throw new BadRequestAlertException("A new entity cannot already have an ID", ENTITY_NAME, "id_exist");
        }
        UnitDTO result = unitService.createUnit(unitDTO);
        return ResponseEntity
            .created(URI.create(result.getId().toString()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @DeleteMapping("/{id}")
    @PostAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERMISSION_MENUITEM_DELETE')")
    public ResponseEntity<Void> deleteUnit(@PathVariable("id") String id) {
        if (id == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        unitService.deleteUnit(UUID.fromString(id));
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
