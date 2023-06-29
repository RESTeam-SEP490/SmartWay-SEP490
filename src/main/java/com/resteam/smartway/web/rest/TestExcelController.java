package com.resteam.smartway.web.rest;

import com.resteam.smartway.helper.Helper;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/downloadTemplate")
public class TestExcelController {

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
}
