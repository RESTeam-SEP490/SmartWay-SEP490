package com.resteam.smartway.web.rest;

import com.resteam.smartway.service.TemplateService;
import com.resteam.smartway.service.UserService;
import com.resteam.smartway.service.dto.IsActiveUpdateDTO;
import com.resteam.smartway.service.dto.StaffDTO;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.URI;
import java.util.*;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;

@RestController
@RequestMapping("/api/staffs")
@RequiredArgsConstructor
@Transactional
public class StaffResource {

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private static final String ENTITY_NAME = "staff";

    private final UserService userService;

    private final TemplateService templateService;

    private final String PATH_TEMPLATE_EXCEL_STAFF = "templates/excel/Staff.xlsx";

    private final String FILE_NAME_STAFF = "Staff.xlsx";

    private final String MEDIA_TYPE = "application/vnd.ms-excel";

    private final String CONTENT_KEY_FILE_INVALID = "staff.fileInvalid";

    private final String CONTENT_KEY_UPLOAD_STAFF = "staff.upload";

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @GetMapping
    public ResponseEntity<List<StaffDTO>> getAllStaffWithSearch(
        Pageable pageable,
        @RequestParam(value = "search", required = false) String searchText,
        @RequestParam(value = "roleIds", required = false) List<String> roleIds,
        @RequestParam(value = "isActive", required = false) Boolean isActive
    ) {
        Page<StaffDTO> staffDTOPage = userService.loadStaffsWithSearch(pageable, searchText, roleIds, isActive);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), staffDTOPage);
        return new ResponseEntity<>(staffDTOPage.getContent(), headers, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<StaffDTO> createStaff(@Valid @RequestBody StaffDTO staffDTO) {
        if (staffDTO.getId() != null) {
            throw new BadRequestAlertException("A new entity cannot already have an ID", ENTITY_NAME, "id_exist");
        }
        StaffDTO result = userService.createStaff(staffDTO);
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

        StaffDTO result = userService.updateStaff(staffDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PutMapping
    public ResponseEntity<StaffDTO> updateIsActiveStaff(@Valid @RequestBody IsActiveUpdateDTO isActiveUpdateDTO) {
        userService.updateIsActiveStaff(isActiveUpdateDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, isActiveUpdateDTO.getIds().toString()))
            .build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteStaffs(@RequestParam(value = "ids") final List<String> ids) {
        userService.deleteStaff(ids);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, String.valueOf(ids)))
            .build();
    }

    @GetMapping("/download-template")
    public ResponseEntity<InputStreamResource> downloadExcel() {
        ByteArrayInputStream stream = templateService.downloadExcelTemplate(PATH_TEMPLATE_EXCEL_STAFF, 1);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + FILE_NAME_STAFF);
        return ResponseEntity.ok().headers(headers).contentType(MediaType.parseMediaType(MEDIA_TYPE)).body(new InputStreamResource(stream));
    }

    @PostMapping("/import-staff")
    public ResponseEntity<?> uploadStaffList(@RequestParam("file") MultipartFile file) throws IOException {
        if (templateService.checkTypeFile(file)) {
            Map<String, String> errorMap = userService.importStaff(file.getInputStream());
            if (errorMap.isEmpty()) {
                return ResponseEntity.ok(CONTENT_KEY_UPLOAD_STAFF);
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
