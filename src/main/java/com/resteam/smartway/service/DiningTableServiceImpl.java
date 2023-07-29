package com.resteam.smartway.service;

import com.resteam.smartway.domain.DiningTable;
import com.resteam.smartway.domain.Zone;
import com.resteam.smartway.repository.DiningTableRepository;
import com.resteam.smartway.repository.ZoneRepository;
import com.resteam.smartway.service.dto.DiningTableDTO;
import com.resteam.smartway.service.dto.IsActiveUpdateDTO;
import com.resteam.smartway.service.mapper.DiningTableMapper;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.io.output.ByteArrayOutputStream;
import org.apache.poi.ss.usermodel.*;
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

    private final String FILE_NAME = "templates/excel/Table.xlsx";
    private final String NAME_SHEET_TABLE = "Table-Manage";
    final String CONTENT_KEY_COLUMN_EMPTY = "diningTable.columnEmpty";
    final String CONTENT_KEY_SEAT_INVALID = "diningTable.seatInvalid";
    final String CONTENT_KEY_SEAT_INTEGER_INVALID = "diningTable.seatIntegerInvalid";

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
            XSSFWorkbook workbook = new XSSFWorkbook(is);
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
                while (cells.hasNext()) {
                    Cell cell = cells.next();
                    switch (cell.getColumnIndex()) {
                        case 0:
                            Optional<Zone> currentZone = zoneRepository.findOneByName(cell.getStringCellValue());
                            if (currentZone.isPresent()) {
                                diningTable.setZone(currentZone.get());
                            } else {
                                Zone newZone = new Zone(null, cell.getStringCellValue());
                                zoneRepository.save(newZone);
                                diningTable.setZone(newZone);
                            }
                            break;
                        case 1:
                            diningTable.setName(cell.getStringCellValue());
                            break;
                        case 2:
                            if (cell.getCellType() == CellType.NUMERIC) {
                                double numericValue = cell.getNumericCellValue();
                                if (numericValue % 1 == 0) {
                                    diningTable.setNumberOfSeats((int) numericValue);
                                } else {
                                    StringBuilder columnName = new StringBuilder(getColumnLabel(3));
                                    errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), CONTENT_KEY_SEAT_INTEGER_INVALID);
                                    noUpload = true;
                                }
                            } else {
                                StringBuilder columnName = new StringBuilder(getColumnLabel(3));
                                errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), CONTENT_KEY_SEAT_INVALID);
                                noUpload = true;
                            }
                            break;
                        default:
                            break;
                    }
                }

                if (diningTable.getName() == null) {
                    StringBuilder columnName = new StringBuilder(getColumnLabel(2));
                    errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), CONTENT_KEY_COLUMN_EMPTY);
                    noUpload = true;
                } else {
                    diningTable.setIsFree(true);
                    diningTable.setIsActive(true);
                    diningTableList.add(diningTable);
                }
                rowNumber++;
            }

            if (!noUpload) {
                diningTableRepository.saveAll(diningTableList);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return errorMap;
    }

    @Override
    public ByteArrayInputStream getDataTableFromExcel(List<DiningTable> diningTableList) throws IOException {
        InputStream inputStream = getClass().getClassLoader().getResourceAsStream(FILE_NAME);
        Workbook workbook = new XSSFWorkbook(inputStream);

        Sheet sheet = workbook.getSheetAt(0);
        int rowIndex = 1;
        for (DiningTable diningTable : diningTableList) {
            Row row = sheet.createRow(rowIndex);
            row.createCell(0).setCellValue(diningTable.getZone().getName());
            row.createCell(1).setCellValue(diningTable.getName());
            row.createCell(2).setCellValue(diningTable.getNumberOfSeats());
            row.createCell(3).setCellValue(diningTable.getIsFree());
            row.createCell(4).setCellValue(diningTable.getIsActive());
            rowIndex++;
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);

        workbook.close();
        inputStream.close();
        return new ByteArrayInputStream(out.toByteArray());
    }

    @Override
    public List<DiningTable> listTable() {
        return diningTableRepository.findAll();
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
}
