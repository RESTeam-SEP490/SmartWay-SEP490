package com.resteam.smartway.web.rest;

import com.itextpdf.text.DocumentException;
import com.resteam.smartway.service.DiningTableService;
import com.resteam.smartway.service.TemplateService;
import com.resteam.smartway.service.dto.DiningTableDTO;
import com.resteam.smartway.service.dto.IsActiveUpdateDTO;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.URI;
import java.util.*;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
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

    private static final String ENTITY_NAME = "diningTable";

    private final DiningTableService diningTableService;

    private final TemplateService templateService;

    private final String PATH_TEMPLATE_EXCEL_TABLE = "templates/excel/Table.xlsx";

    private final String FILE_NAME_TABLE = "Table.xlsx";

    private final String MEDIA_TYPE = "application/vnd.ms-excel";

    private final String CONTENT_KEY_FILE_INVALID = "diningTable.fileInvalid";

    private final String CONTENT_KEY_UPLOAD_TABLE = "diningTable.upload";

    @GetMapping
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
    public ResponseEntity<DiningTableDTO> updateRestaurant(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody DiningTableDTO diningTableDTO
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
    public ResponseEntity<DiningTableDTO> updateRestaurant(@Valid @RequestBody IsActiveUpdateDTO isActiveUpdateDTO) {
        diningTableService.updateIsActiveDiningTables(isActiveUpdateDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, isActiveUpdateDTO.getIds().toString()))
            .build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteRestaurants(@RequestParam(value = "ids") final List<String> ids) {
        diningTableService.deleteDiningTable(ids);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, String.valueOf(ids)))
            .build();
    }

    @GetMapping("/{id}/export-pdf")
    public ResponseEntity<byte[]> exportPdfForDiningTable(@PathVariable UUID id) {
        Optional<DiningTableDTO> diningTable = diningTableService.findById(id);

        if (diningTable.isPresent()) {
            try {
                byte[] pdfContent = diningTableService.generatePdfForDiningTable(diningTable.get());

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_PDF);
                headers.setContentDispositionFormData("inline", "dining_table_" + id + ".pdf");

                return new ResponseEntity<>(pdfContent, headers, HttpStatus.OK);
            } catch (DocumentException e) {
                // Handle exception appropriately
                e.printStackTrace();
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/download-template")
    public ResponseEntity<InputStreamResource> downloadExcel() {
        ByteArrayInputStream stream = templateService.downloadExcelTemplate(PATH_TEMPLATE_EXCEL_TABLE, 3);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + FILE_NAME_TABLE);
        return ResponseEntity.ok().headers(headers).contentType(MediaType.parseMediaType(MEDIA_TYPE)).body(new InputStreamResource(stream));
    }

    @PostMapping("/import-table")
    public ResponseEntity<?> uploadTableList(@RequestParam("file") MultipartFile file) throws IOException {
        if (templateService.checkTypeFile(file)) {
            Map<String, String> errorMap = diningTableService.importDataTable(file.getInputStream());
            if (errorMap.isEmpty()) {
                return ResponseEntity.ok(CONTENT_KEY_UPLOAD_TABLE);
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
