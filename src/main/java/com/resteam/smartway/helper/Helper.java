package com.resteam.smartway.helper;

import com.resteam.smartway.domain.MenuItem;
import com.resteam.smartway.repository.MenuItemRepository;
import java.awt.*;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

public class Helper {

    public static String[] CATEGORY_ITEMS = { "ID", "Name", "Description" };

    public static String[] MENU_ITEMS = { "Category Name", "Item Name", "Description", "Cost Price", "Selling Price" };

    public static final String SHEET_NAME = "list-menu-items";

    public static final MenuItemRepository menuItemRepository = null;

    public static ByteArrayInputStream downloadExcelMenuItemsTemplate() throws IOException {
        Workbook workbook = new SXSSFWorkbook();
        Sheet sheet = workbook.createSheet(SHEET_NAME);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerFont.setColor(IndexedColors.WHITE.getIndex());
        headerStyle.setFillForegroundColor(getCustomColor("#4d81f1"));
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        headerStyle.setFont(headerFont);
        headerStyle.setBorderTop(BorderStyle.THIN);
        headerStyle.setBorderBottom(BorderStyle.THIN);
        headerStyle.setBorderLeft(BorderStyle.THIN);
        headerStyle.setBorderRight(BorderStyle.THIN);
        CellStyle cellStyle = workbook.createCellStyle();
        cellStyle.setBorderTop(BorderStyle.THIN);
        cellStyle.setBorderBottom(BorderStyle.THIN);
        cellStyle.setBorderLeft(BorderStyle.THIN);
        cellStyle.setBorderRight(BorderStyle.THIN);
        try {
            Row row = sheet.createRow(0);
            for (int i = 0; i < MENU_ITEMS.length; i++) {
                Cell cell = row.createCell(i);
                cell.setCellValue(MENU_ITEMS[i]);
                cell.setCellStyle(headerStyle);
                sheet.setColumnWidth(i, 4000);
            }

            for (int i = 1; i < 101; i++) {
                row = sheet.createRow(i);
                Cell cellContent;
                for (int j = 0; j < 5; j++) {
                    cellContent = row.createCell(j);
                    cellContent.setCellStyle(cellStyle);
                }
            }

            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        } finally {
            out.close();
            workbook.close();
        }
    }

    // check type file
    public static boolean checkExcelFormat(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
            return true;
        } else {
            return false;
        }
    }

    public static ByteArrayInputStream dataToExcel(List<MenuItem> list) throws IOException {
        Workbook workbook = new SXSSFWorkbook();
        Sheet sheet = workbook.createSheet(SHEET_NAME);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerFont.setColor(IndexedColors.WHITE.getIndex());
        headerStyle.setFillForegroundColor(getCustomColor("#4d81f1"));
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        headerStyle.setFont(headerFont);
        headerStyle.setBorderTop(BorderStyle.THIN);
        headerStyle.setBorderBottom(BorderStyle.THIN);
        headerStyle.setBorderLeft(BorderStyle.THIN);
        headerStyle.setBorderRight(BorderStyle.THIN);
        CellStyle cellStyle = workbook.createCellStyle();
        cellStyle.setBorderTop(BorderStyle.THIN);
        cellStyle.setBorderBottom(BorderStyle.THIN);
        cellStyle.setBorderLeft(BorderStyle.THIN);
        cellStyle.setBorderRight(BorderStyle.THIN);

        try {
            Row row = sheet.createRow(0);
            for (int i = 0; i < MENU_ITEMS.length; i++) {
                Cell cell = row.createCell(i);
                cell.setCellValue(MENU_ITEMS[i]);
                cell.setCellStyle(headerStyle);
                sheet.setColumnWidth(i, 5000);
            }

            for (int i = 1; i < 101; i++) {
                row = sheet.createRow(i);
                Cell cellContent;
                for (int j = 0; j < 5; j++) {
                    cellContent = row.createCell(j);
                    cellContent.setCellStyle(cellStyle);
                }
            }

            // export data
            int rowIndex = 1;
            for (MenuItem mi : list) {
                Row dataRow = sheet.createRow(rowIndex);
                rowIndex++;
                dataRow.createCell(0).setCellValue(mi.getMenuItemCategory().getName());
                dataRow.createCell(1).setCellValue(mi.getName());
                dataRow.createCell(2).setCellValue(mi.getDescription());
                dataRow.createCell(3).setCellValue(mi.getBasePrice());
                dataRow.createCell(4).setCellValue(mi.getSellPrice());
                for (int i = 0; i < 5; i++) {
                    dataRow.getCell(i).setCellStyle(cellStyle);
                }
            }

            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            workbook.write(out);

            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        } finally {
            workbook.close();
            out.close();
        }
    }

    // custom background color
    private static XSSFColor getCustomColor(String hexCode) {
        java.awt.Color color = java.awt.Color.decode(hexCode);
        byte[] rgb = new byte[] { (byte) color.getRed(), (byte) color.getGreen(), (byte) color.getBlue() };
        return new XSSFColor(rgb);
    }
}
