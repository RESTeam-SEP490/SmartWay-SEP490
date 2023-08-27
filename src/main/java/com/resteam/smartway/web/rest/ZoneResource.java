package com.resteam.smartway.web.rest;

import com.resteam.smartway.service.ZoneService;
import com.resteam.smartway.service.dto.ZoneDTO;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;

@Log4j2
@RestController
@RequestMapping("/api/zone")
@Transactional
@RequiredArgsConstructor
public class ZoneResource {

    private static final String ENTITY_NAME = "zone";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ZoneService zoneService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERMISSION_TABLE', 'PERMISSION_ORDER_ADD_AND_CANCEL')")
    public ResponseEntity<List<ZoneDTO>> loadZones() {
        List<ZoneDTO> zoneList = zoneService.loadAllZones();
        return ResponseEntity.ok(zoneList);
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERMISSION_TABLE')")
    public ResponseEntity<ZoneDTO> createZone(@Valid @RequestBody ZoneDTO zoneDTO) {
        if (zoneDTO.getId() != null) {
            throw new BadRequestAlertException("A new entity cannot already have an ID", ENTITY_NAME, "id_exist");
        }
        ZoneDTO result = zoneService.createZone(zoneDTO);
        return ResponseEntity
            .created(URI.create(result.getId().toString()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERMISSION_TABLE')")
    public ResponseEntity<ZoneDTO> updateRestaurant(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody ZoneDTO zoneDTO
    ) {
        if (zoneDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, zoneDTO.getId().toString())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        ZoneDTO result = zoneService.updateZone(zoneDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERMISSION_TABLE')")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable String id) {
        zoneService.deleteZone(UUID.fromString(id));
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
