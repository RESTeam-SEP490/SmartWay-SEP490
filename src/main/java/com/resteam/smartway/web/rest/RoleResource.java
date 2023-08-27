package com.resteam.smartway.web.rest;

import com.resteam.smartway.service.RoleService;
import com.resteam.smartway.service.dto.RoleDTO;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;

@Log4j2
@RestController
@RequestMapping("/api/roles")
@Transactional
@RequiredArgsConstructor
public class RoleResource {

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private static final String ENTITY_NAME = "role";
    private final RoleService roleService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERMISSION_STAFF')")
    public ResponseEntity<RoleDTO> createRole(@Valid @RequestBody RoleDTO roleDTO) {
        if (roleDTO.getId() != null) {
            throw new BadRequestAlertException("A new entity cannot already have an ID", ENTITY_NAME, "id_exist");
        }
        RoleDTO result = roleService.createRole(roleDTO);
        return ResponseEntity
            .created(URI.create(result.getId().toString()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERMISSION_STAFF')")
    public ResponseEntity<List<RoleDTO>> getAllRoles(Pageable pageable) {
        return ResponseEntity.ok(roleService.getAllRoles(pageable));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERMISSION_STAFF')")
    public ResponseEntity<RoleDTO> updateRole(@PathVariable(value = "id") final String id, @Valid @RequestBody RoleDTO roleDTO) {
        if (roleDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, roleDTO.getId().toString())) {
            throw new BadRequestAlertException("Invalid Id", ENTITY_NAME, "idinvalid");
        }

        RoleDTO result = roleService.updateRole(roleDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERMISSION_STAFF')")
    public ResponseEntity<Void> deleteRole(@PathVariable(value = "id") String id) {
        roleService.deleteRole(UUID.fromString(id));
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
