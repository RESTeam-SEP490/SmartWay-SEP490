package com.resteam.smartway.helper;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFColor;

public class Helper {

    public static String[] CATEGORY_ITEMS = { "ID", "Name", "Description" };

    public static String[] MENU_ITEMS = { "Category Name", "Item Name", "Description", "Cost Price", "Selling Price" };

    public static final String SHEET_NAME = "list-menu-items";

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
        CellStyle titleStyle = workbook.createCellStyle();
        Font titleFont = workbook.createFont();
        titleFont.setBold(true);
        titleFont.setFontHeightInPoints((short) 20);
        titleStyle.setFont(titleFont);
        try {
            Row rowTitle = sheet.createRow(1);
            Cell cellTitle = rowTitle.createCell(1);
            cellTitle.setCellValue("LIST MENU ITEMS");
            cellTitle.setCellStyle(titleStyle);

            Row row = sheet.createRow(3);
            for (int i = 0; i < MENU_ITEMS.length; i++) {
                Cell cell = row.createCell(i);
                cell.setCellValue(MENU_ITEMS[i]);
                cell.setCellStyle(headerStyle);
                sheet.setColumnWidth(i, 4000);
            }

            for (int i = 4; i < 15; i++) {
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

    // custom background color
    private static XSSFColor getCustomColor(String hexCode) {
        java.awt.Color color = java.awt.Color.decode(hexCode);
        byte[] rgb = new byte[] { (byte) color.getRed(), (byte) color.getGreen(), (byte) color.getBlue() };
        return new XSSFColor(rgb);
    }
}
