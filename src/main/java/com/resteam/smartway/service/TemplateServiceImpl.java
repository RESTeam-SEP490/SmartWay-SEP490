package com.resteam.smartway.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.output.ByteArrayOutputStream;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.bouncycastle.crypto.InvalidCipherTextException;
import org.bouncycastle.crypto.engines.AESEngine;
import org.bouncycastle.crypto.modes.CFBBlockCipher;
import org.bouncycastle.crypto.paddings.PaddedBufferedBlockCipher;
import org.bouncycastle.crypto.params.KeyParameter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
@RequiredArgsConstructor
public class TemplateServiceImpl implements TemplateService {

    private final String NAME_SHEET = "Secret_Key";
    private final String SECRET_KEY = "@smartway_@upload_@staff";

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
            workbook.setSheetHidden(workbook.getSheetIndex(NAME_SHEET), true);
            byte[] encryptedKey = encryptSecretKey(SECRET_KEY);
            String encryptedKeyString = Base64.getEncoder().encodeToString(encryptedKey);
            Row row = sheet.getRow(0);
            if (row == null) {
                row = sheet.createRow(0);
            }
            Cell cell = row.getCell(0);
            if (cell == null) {
                cell = row.createCell(0);
            }
            cell.setCellValue(encryptedKeyString);
            CellStyle hiddenCellStyle = workbook.createCellStyle();
            DataFormat dataFormat = workbook.createDataFormat();
            hiddenCellStyle.setDataFormat(dataFormat.getFormat(";;;"));
            cell.setCellStyle(hiddenCellStyle);
            sheet.protectSheet("#2Xy@gRc#7!D");

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        } catch (InvalidCipherTextException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean checkTypeFile(MultipartFile file) {
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet".equals(file.getContentType());
    }

    private byte[] encryptSecretKey(String key) throws InvalidCipherTextException {
        byte[] keyBytes = key.getBytes();
        PaddedBufferedBlockCipher cipher = new PaddedBufferedBlockCipher(
            new CFBBlockCipher(new AESEngine(), 128),
            new org.bouncycastle.crypto.paddings.PKCS7Padding()
        );
        cipher.init(true, new KeyParameter(keyBytes));
        byte[] encryptedKey = new byte[cipher.getOutputSize(keyBytes.length)];
        int outputLength = cipher.processBytes(keyBytes, 0, keyBytes.length, encryptedKey, 0);
        outputLength += cipher.doFinal(encryptedKey, outputLength);
        return encryptedKey;
    }
}
