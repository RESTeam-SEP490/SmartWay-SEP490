package com.resteam.smartway.service;

import com.resteam.smartway.domain.MenuItem;
import com.resteam.smartway.domain.MenuItemCategory;
import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.helper.Helper;
import com.resteam.smartway.repository.MenuItemCategoryRepository;
import com.resteam.smartway.repository.MenuItemRepository;
import com.resteam.smartway.security.SecurityUtils;
import com.resteam.smartway.service.aws.S3Service;
import com.resteam.smartway.service.dto.MenuItemDTO;
import com.resteam.smartway.service.mapper.MenuItemMapper;
import com.resteam.smartway.web.rest.errors.RestaurantInfoNotFoundException;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;
import javax.validation.Valid;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class MenuItemServiceImpl implements MenuItemService {

    private final MenuItemRepository menuItemRepository;

    private final MenuItemCategoryRepository menuItemCategoryRepository;

    private final S3Service s3Service;

    private final MenuItemMapper menuItemMapper;

    @Override
    public Page<MenuItemDTO> loadMenuItemsWithSearch(Pageable pageable, String searchText, List<String> categoryIds) {
        String restaurantId = SecurityUtils.getCurrentRestaurantId().orElseThrow(RestaurantInfoNotFoundException::new);
        if (searchText != null) searchText = searchText.toLowerCase();
        List<UUID> categoryUuidList = null;
        if (categoryIds != null && categoryIds.size() > 0) categoryUuidList =
            categoryIds.stream().map(c -> UUID.fromString(c)).collect(Collectors.toList());
        Page<MenuItem> menuItemPage = menuItemRepository.findWithFilterParams(restaurantId, searchText, categoryUuidList, pageable);

        return menuItemPage.map(item -> {
            String imageUrl = s3Service.getUploadUrl(item.getImageKey());
            MenuItemDTO menuItem = menuItemMapper.toDto(item);
            menuItem.setImageUrl(imageUrl);
            return menuItem;
        });
    }

    @Override
    @SneakyThrows
    public void createMenuItem(@Valid MenuItemDTO menuItemDTO, MultipartFile imageSource) {
        String restaurantId = SecurityUtils.getCurrentRestaurantId().orElseThrow(RestaurantInfoNotFoundException::new);

        MenuItem menuItem = menuItemMapper.toEntity(menuItemDTO);

        String menuItemCode = generateCode(restaurantId);

        if (imageSource != null) {
            String path = String.format("%s/menu-items/%s", restaurantId, menuItemCode);
            s3Service.uploadImage(imageSource, path);
            menuItem.setImageKey(path);
        }
        menuItem.setCode(menuItemCode);
        menuItem.setRestaurant(new Restaurant(restaurantId));

        menuItemRepository.save(menuItem);
    }

    public ResponseEntity<?> convertExcelToListOfMenuItem(InputStream is) {
        List<MenuItem> menuItemList = new ArrayList<>();
        List<String> errorMessages = new ArrayList<>(); // Danh sách thông báo lỗi

        try {
            XSSFWorkbook workbook = new XSSFWorkbook(is);
            XSSFSheet sheet = workbook.getSheet("list-menu-items");
            int rowNumber = 0;
            Iterator<Row> iterator = sheet.iterator();
            while (iterator.hasNext()) {
                Row row = iterator.next();
                if (rowNumber == 0) {
                    rowNumber++;
                    continue;
                }
                Iterator<Cell> cells = row.iterator();
                MenuItem menuItem = new MenuItem();
                boolean isEmptyRow = true;
                while (cells.hasNext()) {
                    Cell cell = cells.next();
                    if (cell.getCellType() != CellType.BLANK) {
                        isEmptyRow = false;
                    }
                    switch (cell.getColumnIndex()) {
                        case 0:
                            if (!isEmptyRow) {
                                String menuItemCode = generateCode("huy2");
                                menuItem.setRestaurant(new Restaurant("huy2"));
                                menuItem.setIsActive(Boolean.TRUE);
                                menuItem.setIsInStock(Boolean.TRUE);
                                menuItem.setCode(menuItemCode);
                                boolean isCategory = validateMenuItemCategory(cell.getStringCellValue());
                                if (isCategory) {
                                    MenuItemCategory menuItemCategoryCurrent = menuItemCategoryRepository.findByName(
                                        cell.getStringCellValue()
                                    );
                                    menuItem.setMenuItemCategory(menuItemCategoryCurrent);
                                } else {
                                    errorMessages.add("Category not found: " + cell.getStringCellValue() + " in Row " + rowNumber);
                                }
                            }
                            break;
                        case 1:
                            if (!isEmptyRow) {
                                menuItem.setName(cell.getStringCellValue());
                            }
                            break;
                        case 2:
                            if (!isEmptyRow) {
                                menuItem.setDescription(cell.getStringCellValue());
                            }
                            break;
                        case 3:
                            if (!isEmptyRow) {
                                if (validateNumericCellValue(cell, 3)) {
                                    menuItem.setBasePrice(cell.getNumericCellValue());
                                } else {
                                    errorMessages.add("Invalid Cost Price in Row " + rowNumber + ": only numeric values are allowed.");
                                }
                            }
                            break;
                        case 4:
                            if (!isEmptyRow) {
                                if (validateNumericCellValue(cell, 4)) {
                                    menuItem.setSellPrice(cell.getNumericCellValue());
                                    menuItem.setSellPrice(cell.getNumericCellValue());
                                } else {
                                    errorMessages.add("Invalid Selling Price in Row " + rowNumber + ": only numeric values are allowed.");
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }

                if (!isEmptyRow && hasEmptyCells(row)) {
                    errorMessages.add("Row " + rowNumber + " contains empty cells."); // Thêm thông báo lỗi khi row thiếu cell
                } else if (!isEmptyRow) {
                    menuItemList.add(menuItem);
                }

                rowNumber++;
            }

            if (!errorMessages.isEmpty()) {
                String errorMessage = String.join("\n", errorMessages);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
            } else {
                menuItemRepository.saveAll(menuItemList);
                return ResponseEntity.ok("Upload successful");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }

    @Override
    public ByteArrayInputStream getListMenuItemsForExcel() throws IOException {
        List<MenuItem> menuItemList = menuItemRepository.findAll();
        return Helper.dataToExcel(menuItemList);
    }

    private boolean hasEmptyCells(Row row) {
        Iterator<Cell> cells = row.iterator();
        while (cells.hasNext()) {
            Cell cell = cells.next();
            if (cell.getCellType() == CellType.BLANK) {
                return true;
            }
        }
        return false;
    }

    private boolean validateMenuItemCategory(String categoryName) {
        MenuItemCategory menuItemCategory = menuItemCategoryRepository.findByName(categoryName);
        if (menuItemCategory == null) {
            return false;
        }
        return true;
    }

    private boolean validateNumericCellValue(Cell cell, int cellIndex) {
        if (cell.getCellType() != CellType.NUMERIC) {
            return false;
        }
        return true;
    }

    private String generateCode(String restaurantId) {
        Optional<MenuItem> lastMenuItem = menuItemRepository.findTopByRestaurantOrderByCodeDesc(new Restaurant(restaurantId));
        if (lastMenuItem.isEmpty()) return "MI000001"; else {
            String lastCode = lastMenuItem.get().getCode();
            int nextCodeInt = Integer.parseInt(lastCode.substring(2)) + 1;
            if (nextCodeInt > 999999) throw new IllegalStateException("Maximum Code reached");
            return String.format("MI%06d", nextCodeInt);
        }
    }
}
