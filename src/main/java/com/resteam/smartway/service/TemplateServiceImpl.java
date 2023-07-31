package com.resteam.smartway.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.output.ByteArrayOutputStream;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
@RequiredArgsConstructor
public class TemplateServiceImpl implements TemplateService {

    private final String NAME_SHEET = "SHEET";

    @Override
    public ByteArrayInputStream downloadExcelTemplate(String path) {
        Path templatePath = Paths.get("src", "main", "resources", path);

        try (
            InputStream inputStream = Files.newInputStream(templatePath);
            Workbook workbook = new XSSFWorkbook(inputStream);
            ByteArrayOutputStream out = new ByteArrayOutputStream()
        ) {
            Sheet sheet = workbook.getSheet(NAME_SHEET);
            if (sheet == null) {
                sheet = workbook.createSheet(NAME_SHEET);
            }
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public boolean checkTypeFile(MultipartFile file) {
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet".equals(file.getContentType());
    }
}
