package com.resteam.smartway.web.rest;

import com.resteam.smartway.domain.User;
import com.resteam.smartway.service.InvalidPasswordException;
import com.resteam.smartway.service.StaffService;
import com.resteam.smartway.service.dto.MenuItemDTO;
import com.resteam.smartway.service.dto.StaffDTO;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import com.resteam.smartway.web.rest.vm.ManagedUserVM;
import java.net.URI;
import java.util.List;
import java.util.Objects;
import javax.validation.Valid;
import org.apache.commons.lang3.StringUtils;
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

@RestController
@RequestMapping("/api/staffs")
@Transactional
public class StaffResource {

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private static final String ENTITY_NAME = "staff";

    private final StaffService staffService;

    public StaffResource(StaffService staffService) {
        this.staffService = staffService;
    }

    @GetMapping
    public ResponseEntity<List<StaffDTO>> getAllStaffWithSearch(
        Pageable pageable,
        @RequestParam(value = "search", required = false) String searchText,
        @RequestParam(value = "roleIds", required = false) List<String> roleIds
    ) {
        Page<StaffDTO> staffDTOPage = staffService.loadStaffsWithSearch(pageable, searchText, roleIds);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), staffDTOPage);

        return new ResponseEntity<>(staffDTOPage.getContent(), headers, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<StaffDTO> createStaff(@Valid @RequestBody StaffDTO staffDTO) {
        if (staffDTO.getId() != null) {
            throw new BadRequestAlertException("A new entity cannot already have an ID", ENTITY_NAME, "id_exist");
        }
        StaffDTO result = staffService.createStaff(staffDTO);
        return ResponseEntity
            .created(URI.create(result.getId().toString()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(staffDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StaffDTO> updateStaff(@PathVariable(value = "id") final String id, @Valid @RequestBody StaffDTO staffDTO) {
        if (staffDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "id null");
        }
        if (!Objects.equals(id, staffDTO.getId().toString())) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "id invalid");
        }

        StaffDTO result = staffService.updateStaff(staffDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteStaffs(@RequestParam(value = "ids") final List<String> ids) {
        staffService.deleteStaff(ids);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, String.valueOf(ids)))
            .build();
    }

    private static boolean isPasswordLengthInvalid(String password) {
        return (
            StringUtils.isEmpty(password) ||
            password.length() < ManagedUserVM.PASSWORD_MIN_LENGTH ||
            password.length() > ManagedUserVM.PASSWORD_MAX_LENGTH
        );
    }
}
