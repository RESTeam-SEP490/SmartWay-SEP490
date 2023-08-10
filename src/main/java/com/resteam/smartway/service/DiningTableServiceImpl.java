package com.resteam.smartway.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.resteam.smartway.domain.DiningTable;
import com.resteam.smartway.domain.Zone;
import com.resteam.smartway.repository.DiningTableRepository;
import com.resteam.smartway.repository.ZoneRepository;
import com.resteam.smartway.service.dto.DiningTableDTO;
import com.resteam.smartway.service.dto.IsActiveUpdateDTO;
import com.resteam.smartway.service.mapper.DiningTableMapper;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class DiningTableServiceImpl implements DiningTableService {

    private static final String ENTITY_NAME = "dining_table";

    private final DiningTableRepository diningTableRepository;

    private final ZoneRepository zoneRepository;

    private final DiningTableMapper diningTableMapper;
    private final ZoneService zoneService;
    private final String NAME_SHEET_TABLE = "Table-Manage";
    private final String CONTENT_KEY_COLUMN_EMPTY = "diningTable.columnEmpty";
    private final String CONTENT_KEY_SEAT_INVALID = "diningTable.seatInvalid";
    private final String CONTENT_KEY_SEAT_INTEGER_INVALID = "diningTable.seatIntegerInvalid";
    private final String CONTENT_KEY_SHEET_NAME_INVALID = "diningTable.sheetInvalidName";
    private final String NAME_SHEET_SECRET_KEY = "Secret_Key";
    private static final String SECRET_KEY_ENCRYPT = "lUcV6iYbiEtmXQze5RQf92eJLeJe6LPOFwgP0YRBwJc=";
    private final String REGEX_ZONE = "^.{1,50}$";
    private final String MESSAGE_ZONE = "diningTable.regexZone";
    private final String REGEX_TABLE_NAME = "^.{1,50}$";
    private final String MESSAGE_TABLE_NAME = "diningTable.regexTableName";
    private final String REGEX_NUMBER_OF_SEAT = "^[1-9][0-9]*$";
    private final String MESSAGE_NUMBER_OF_SEAT = "diningTable.regexNumberOfSeat";
    private final String CONTENT_TABLE_NAME_EXIST = "diningTable.regexTableNameExist";

    @Override
    public Page<DiningTableDTO> loadDiningTablesWithSearch(Pageable pageable, String searchText, List<String> zoneIds, Boolean isActive) {
        if (searchText != null) searchText = searchText.toLowerCase();
        List<UUID> zoneUuidList = null;
        if (zoneIds != null && zoneIds.size() > 0) zoneUuidList =
            zoneIds.stream().map(c -> UUID.fromString(c)).collect(Collectors.toList());
        Page<DiningTable> diningTablePage = diningTableRepository.findWithFilterParams(searchText, zoneUuidList, isActive, pageable);
        return diningTablePage.map(item -> {
            DiningTableDTO diningTable = diningTableMapper.toDto(item);
            return diningTable;
        });
    }

    @Override
    @SneakyThrows
    public DiningTableDTO createDiningTable(DiningTableDTO diningTableDTO) {
        DiningTable diningTable = diningTableMapper.toEntity(diningTableDTO);
        if (diningTableDTO.getZone() != null) {
            UUID zoneId = diningTableDTO.getZone().getId();
            Zone zone = zoneRepository
                .findById(zoneId)
                .orElseThrow(() -> new BadRequestAlertException("Zone is not found", ENTITY_NAME, "idnotfound"));
            diningTable.setZone(zone);
        }
        diningTable.setIsFree(true);
        diningTable.setIsActive(true);

        return diningTableMapper.toDto(diningTableRepository.save(diningTable));
    }

    @Override
    @SneakyThrows
    public DiningTableDTO updateDiningTable(DiningTableDTO diningTableDTO) {
        DiningTable diningTable = diningTableRepository
            .findById(diningTableDTO.getId())
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
        if (diningTableDTO.getZone() != null) {
            UUID zoneId = diningTableDTO.getZone().getId();
            Zone zone = zoneRepository
                .findById(zoneId)
                .orElseThrow(() -> new BadRequestAlertException("Zone is not found", ENTITY_NAME, "idnotfound"));
            diningTable.setZone(zone);
        }
        diningTableMapper.partialUpdate(diningTable, diningTableDTO);

        DiningTable result = diningTableRepository.save(diningTable);
        return diningTableMapper.toDto(result);
    }

    @Override
    public void deleteDiningTable(List<String> ids) {
        List<DiningTable> diningTableIdList = ids
            .stream()
            .map(id -> {
                if (id == null) throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
                return diningTableRepository
                    .findById(UUID.fromString(id))
                    .orElseThrow(() -> new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idnotfound"));
            })
            .collect(Collectors.toList());
        diningTableRepository.deleteAll(diningTableIdList);
    }

    @Override
    public void updateIsActiveDiningTables(IsActiveUpdateDTO isActiveUpdateDTO) {
        List<DiningTable> diningTableList = isActiveUpdateDTO
            .getIds()
            .stream()
            .map(id -> {
                if (id == null) throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
                DiningTable diningTable = diningTableRepository
                    .findById(UUID.fromString(id))
                    .orElseThrow(() -> new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idnotfound"));
                diningTable.setIsActive(isActiveUpdateDTO.getIsActive());
                return diningTable;
            })
            .collect(Collectors.toList());
        diningTableRepository.saveAll(diningTableList);
    }

    @Override
    public Map<String, String> importDataTable(InputStream is) {
        Map<String, String> errorMap = new HashMap<>();
        List<DiningTable> diningTableList = new ArrayList<>();
        boolean noUpload = false;
        try {
            String secretKeyInFile = null;
            XSSFWorkbook workbook = new XSSFWorkbook(is);
            XSSFSheet sheetSecretKey = workbook.getSheet(NAME_SHEET_SECRET_KEY);
            if (sheetSecretKey != null) {
                Row row = sheetSecretKey.getRow(0);
                if (row != null) {
                    Cell cell = row.getCell(0);
                    if (cell != null && cell.getCellType() == CellType.STRING) {
                        secretKeyInFile = cell.getStringCellValue();
                    }
                }
            }
            if (secretKeyInFile == null) {
                errorMap.put("staff.nullSecretKey", "");
                return errorMap;
            }

            if (checkSecretKey(secretKeyInFile)) {
                XSSFSheet sheet = workbook.getSheet(NAME_SHEET_TABLE);
                int rowNumber = 0;
                Iterator<Row> iterator = sheet.iterator();
                boolean os = true;
                while (iterator.hasNext()) {
                    Row row = iterator.next();
                    if (rowNumber == 0) {
                        rowNumber++;
                        continue;
                    }
                    Iterator<Cell> cells = row.iterator();
                    DiningTable diningTable = new DiningTable();
                    String zoneString = null;
                    boolean isSaveZone = false;
                    boolean isTableNameChecked = false;
                    List<String> keysToRemove = new ArrayList<>();
                    DecimalFormat decimalFormat = new DecimalFormat("#");
                    while (cells.hasNext()) {
                        Cell cell = cells.next();
                        switch (cell.getColumnIndex()) {
                            case 0:
                                Optional<Zone> currentZone = zoneRepository.findOneByName(cell.getStringCellValue());
                                if (currentZone.isPresent()) {
                                    diningTable.setZone(currentZone.get());
                                } else {
                                    isSaveZone = true;
                                    zoneString = cell.getStringCellValue();
                                    if (zoneString.equals("")) {
                                        isSaveZone = false;
                                    }
                                }
                                break;
                            case 1:
                                Optional<DiningTable> diningTableOptional = diningTableRepository.findOneByName(cell.getStringCellValue());
                                if (diningTableOptional.isPresent()) {
                                    noUpload = true;
                                    isTableNameChecked = true;
                                    StringBuilder columnName = new StringBuilder(getColumnLabel(2));
                                    errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), CONTENT_TABLE_NAME_EXIST);
                                    keysToRemove.add(getColumnLabel(2) + (rowNumber + 1));
                                } else {
                                    isTableNameChecked = true;
                                    diningTable.setName(cell.getStringCellValue());
                                }
                                diningTable.setName(cell.getStringCellValue());
                                break;
                            case 2:
                                diningTable.setNumberOfSeats((int) cell.getNumericCellValue());
                                break;
                            default:
                                break;
                        }
                    }

                    boolean isValidated = true;

                    if (
                        (diningTable.getName() == null || diningTable.getName().equals("")) &&
                        (diningTable.getZone() == null && !isSaveZone) &&
                        (diningTable.getNumberOfSeats() == null || diningTable.getNumberOfSeats().equals(0))
                    ) {
                        if (diningTableList.isEmpty()) {
                            if (errorMap.isEmpty()) {
                                errorMap.put("Table.xlsx ", "diningTable.emptyFileName");
                            }

                            if (rowNumber == 2) {
                                for (String key : keysToRemove) {
                                    errorMap.remove(key);
                                }
                            }
                        } else {
                            for (String key : keysToRemove) {
                                errorMap.remove(key);
                            }
                        }
                        break;
                    }

                    if (diningTable.getZone() != null) {
                        if (!Pattern.matches(REGEX_ZONE, diningTable.getZone().getName())) {
                            isValidated = false;
                            noUpload = true;
                            StringBuilder columnName = new StringBuilder(getColumnLabel(1));
                            errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), MESSAGE_ZONE);
                            keysToRemove.add(getColumnLabel(1) + (rowNumber + 1));
                        }
                    }

                    if (diningTable.getName() == null) {
                        if (!isTableNameChecked) {
                            isValidated = false;
                            StringBuilder columnName = new StringBuilder(getColumnLabel(2));
                            errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), CONTENT_KEY_COLUMN_EMPTY);
                            keysToRemove.add(getColumnLabel(2) + (rowNumber + 1));
                            noUpload = true;
                        }
                    } else {
                        if (!Pattern.matches(REGEX_TABLE_NAME, diningTable.getName())) {
                            isValidated = false;
                            noUpload = true;
                            StringBuilder columnName = new StringBuilder(getColumnLabel(2));
                            errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), MESSAGE_TABLE_NAME);
                            keysToRemove.add(getColumnLabel(2) + (rowNumber + 1));
                        }
                        if (diningTable.getName().equals("")) {
                            isValidated = false;
                            noUpload = true;
                            StringBuilder columnName = new StringBuilder(getColumnLabel(2));
                            errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), CONTENT_KEY_COLUMN_EMPTY);
                            keysToRemove.add(getColumnLabel(2) + (rowNumber + 1));
                        }
                    }

                    if (diningTable.getNumberOfSeats() == null) {
                        isValidated = false;
                        StringBuilder columnName = new StringBuilder(getColumnLabel(3));
                        errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), CONTENT_KEY_COLUMN_EMPTY);
                        keysToRemove.add(getColumnLabel(3) + (rowNumber + 1));
                        noUpload = true;
                    } else {
                        if (!Pattern.matches(REGEX_NUMBER_OF_SEAT, String.valueOf(diningTable.getNumberOfSeats()))) {
                            isValidated = false;
                            noUpload = true;
                            StringBuilder columnName = new StringBuilder(getColumnLabel(3));
                            errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), MESSAGE_NUMBER_OF_SEAT);
                            keysToRemove.add(getColumnLabel(3) + (rowNumber + 1));
                        }
                        if (diningTable.getNumberOfSeats().equals(0)) {
                            isValidated = false;
                            noUpload = true;
                            StringBuilder columnName = new StringBuilder(getColumnLabel(3));
                            errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), CONTENT_KEY_COLUMN_EMPTY);
                            keysToRemove.add(getColumnLabel(3) + (rowNumber + 1));
                        }
                    }

                    if (isValidated) {
                        if (isSaveZone) {
                            Zone zone = new Zone(null, zoneString);
                            diningTable.setZone(zone);
                        }
                        diningTable.setIsFree(true);
                        diningTable.setIsActive(true);
                        diningTableList.add(diningTable);
                    }
                    rowNumber++;
                }

                if (!noUpload) {
                    if (diningTableList.isEmpty()) {
                        errorMap.put("Table.xlsx ", "diningTable.emptyFileName");
                    } else {
                        for (DiningTable newTable : diningTableList) {
                            zoneRepository.save(newTable.getZone());
                        }
                        diningTableRepository.saveAll(diningTableList);
                    }
                }
            } else {
                errorMap.put("diningTable.invalidSecretKey", "");
                return errorMap;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return errorMap;
    }

    private boolean checkSecretKey(String secretKey) {
        return secretKey.equals(SECRET_KEY_ENCRYPT);
    }

    private String getColumnLabel(int column) {
        StringBuilder label = new StringBuilder();
        while (column > 0) {
            column--;
            label.insert(0, (char) ('A' + (column % 26)));
            column /= 26;
        }
        return label.toString();
    }

    @Override
    public Optional<DiningTableDTO> findById(UUID uuid) {
        Optional<DiningTable> diningTableOptional = diningTableRepository.findById(uuid);
        return diningTableOptional.map(diningTableMapper::toDto);
    }

    @Override
    public byte[] generatePdfForDiningTable(DiningTableDTO diningTableDTO) throws DocumentException {
        Document document = new Document(PageSize.A7, 12, 12, 12, 12);

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, byteArrayOutputStream);

        // Customize PDF styles
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, BaseColor.BLACK);
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, BaseColor.DARK_GRAY);
        Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 8, BaseColor.GRAY);

        document.open();

        // Add a title to the document
        Paragraph nameRestaurant = new Paragraph("SmartWay", titleFont);
        Paragraph address = new Paragraph("Address: FPT University", titleFont);
        Paragraph phone = new Paragraph("Phone: 0888666789", titleFont);
        Paragraph line = new Paragraph("----------------", titleFont);
        Paragraph timeIn = new Paragraph("TimeIn: ", headerFont);
        Paragraph timeOut = new Paragraph("TimeOut: " + getCurrentTime(), headerFont);
        Paragraph staff = new Paragraph("Staff: ", headerFont);
        nameRestaurant.setAlignment(Element.ALIGN_CENTER);
        address.setAlignment(Element.ALIGN_CENTER);
        phone.setAlignment(Element.ALIGN_CENTER);
        line.setAlignment(Element.ALIGN_CENTER);
        timeIn.setAlignment(Element.ALIGN_LEFT);
        timeOut.setAlignment(Element.ALIGN_LEFT);
        staff.setAlignment(Element.ALIGN_LEFT);
        document.add(nameRestaurant);
        document.add(address);
        document.add(phone);
        document.add(line);
        document.add(timeIn);
        document.add(timeOut);
        document.add(staff);

        document.add(Chunk.NEWLINE); // Add some space between title and table content

        // Add table content with headers and values in separate rows
        PdfPTable table = new PdfPTable(3);
        table.setWidthPercentage(100);

        // Header row with relative widths
        float[] columnWidths = { 50f, 20f, 30f }; // Adjust the percentages here
        table.setWidths(columnWidths);
        // Header row
        addHeaderWithStyle(table, "Dining Table ID", headerFont);
        addHeaderWithStyle(table, "Name", headerFont);
        addHeaderWithStyle(table, "Number of Seats", headerFont);

        // Data row
        addValueWithStyle(table, String.valueOf(diningTableDTO.getId()), normalFont);
        addValueWithStyle(table, diningTableDTO.getName(), normalFont);
        addValueWithStyle(table, String.valueOf(diningTableDTO.getNumberOfSeats()), normalFont);

        document.add(table);

        float spacingAfterTable = 10f; // Adjust the spacing as needed (in points)
        table.setSpacingAfter(spacingAfterTable);

        Paragraph subTotal = new Paragraph("SubTotal: ", headerFont);
        subTotal.setAlignment(Element.ALIGN_LEFT);
        document.add(subTotal);
        Paragraph total = new Paragraph("Total: ", headerFont);
        total.setAlignment(Element.ALIGN_LEFT);
        document.add(total);

        document.add(line);

        String imageUrl = "https://static.vecteezy.com/system/resources/previews/002/557/391/original/qr-code-for-scanning-free-vector.jpg";
        try {
            // Add an image from an online URL to the document
            Image logo = Image.getInstance(new URL(imageUrl));
            logo.scaleToFit(75f, 75f);
            logo.setAlignment(Element.ALIGN_CENTER);
            document.add(logo);

            float spacingBeforeImage = 0f; // Adjust the spacing as needed (in points)
            float spacingAfterImage = 0f; // Adjust the spacing as needed (in points)
            logo.setSpacingBefore(spacingBeforeImage);
            logo.setSpacingAfter(spacingAfterImage);

            Paragraph poweredBy = new Paragraph("Powered By SmartWay.website", titleFont);
            poweredBy.setAlignment(Element.ALIGN_CENTER);
            document.add(poweredBy);
        } catch (MalformedURLException e) {
            // Handle MalformedURLException
            System.err.println("MalformedURLException: Invalid URL format. Please check the URL.");
            e.printStackTrace();
            // Return or throw an appropriate error message or perform error handling as needed.
        } catch (IOException e) {
            // Handle IOException
            System.err.println("IOException: There was an error fetching the image from the provided URL.");
            e.printStackTrace();
            // Return or throw an appropriate error message or perform error handling as needed.
        } catch (BadElementException e) {
            // Handle BadElementException
            System.err.println("BadElementException: Error while adding the image to the PDF.");
            e.printStackTrace();
            // Return or throw an appropriate error message or perform error handling as needed.
        }

        document.close();

        return byteArrayOutputStream.toByteArray();
    }

    private static void addHeaderWithStyle(PdfPTable table, String text, Font font) {
        PdfPCell headerCell = new PdfPCell(new Phrase(text, font));
        headerCell.setBorder(Rectangle.BOTTOM); // Show only the bottom border
        headerCell.setBorderColorBottom(BaseColor.DARK_GRAY);
        headerCell.setBorderWidthBottom(1f); // Set the thickness of the bottom border
        headerCell.setBorderWidthLeft(0f); // Remove left border
        headerCell.setBorderWidthRight(0f); // Remove right border
        headerCell.setHorizontalAlignment(Element.ALIGN_LEFT);
        headerCell.setPaddingBottom(5f);
        table.addCell(headerCell);
    }

    private static void addValueWithStyle(PdfPTable table, String text, Font font) {
        PdfPCell valueCell = new PdfPCell(new Phrase(text, font));
        valueCell.setBorder(Rectangle.BOTTOM); // Show only the bottom border
        valueCell.setBorderColorBottom(BaseColor.BLACK);
        valueCell.setBorderWidthBottom(1f); // Set the thickness of the bottom border
        valueCell.setBorderWidthLeft(0f); // Remove left border
        valueCell.setBorderWidthRight(0f); // Remove right border
        valueCell.setHorizontalAlignment(Element.ALIGN_LEFT);
        valueCell.setPaddingTop(5f);
        valueCell.setPaddingBottom(8f);
        table.addCell(valueCell);
    }

    private String getCurrentTime() {
        Date now = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return sdf.format(now);
    }
}
