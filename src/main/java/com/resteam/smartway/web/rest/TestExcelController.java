package com.resteam.smartway.web.rest;

import com.resteam.smartway.helper.Helper;
import com.resteam.smartway.service.MenuItemService;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Map;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/downloadTemplate")
public class TestExcelController {

    private final MenuItemService menuItemService;

    public TestExcelController(MenuItemService menuItemService) {
        this.menuItemService = menuItemService;
    }

    @GetMapping("")
    public ResponseEntity<Resource> downloadTemplate() throws IOException {
        String fileName = "menu-items.xlsx";
        ByteArrayInputStream actualData = Helper.downloadExcelMenuItemsTemplate();
        InputStreamResource file = new InputStreamResource(actualData);
        ResponseEntity<Resource> body = ResponseEntity
            .ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
            .contentType(MediaType.parseMediaType("application/vnd.ms-excel"))
            .body(file);
        return body;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile multipartFile) throws IOException {
        if (Helper.checkExcelFormat(multipartFile)) {
            ResponseEntity<?> response = this.menuItemService.convertExcelToListOfMenuItem(multipartFile.getInputStream());
            if (response.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.ok(Map.of("message", "File is uploaded and " + response.getBody()));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response.getBody());
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please upload only Excel file");
    }
}
