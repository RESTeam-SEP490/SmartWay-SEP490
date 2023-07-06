package com.resteam.smartway.web.rest;

import com.resteam.smartway.service.RoleService;
import com.resteam.smartway.service.dto.RoleDTO;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.util.List;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<RoleDTO>> getAllRoles() {
        return ResponseEntity.ok(roleService.getAllRoles());
    }
}
