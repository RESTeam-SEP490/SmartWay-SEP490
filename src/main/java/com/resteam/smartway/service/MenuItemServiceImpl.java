package com.resteam.smartway.service;

import com.amazonaws.services.kms.model.NotFoundException;
import com.resteam.smartway.domain.MenuItem;
import com.resteam.smartway.domain.MenuItemCategory;
import com.resteam.smartway.domain.MenuItemCategory;
import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.helper.Helper;
import com.resteam.smartway.repository.MenuItemCategoryRepository;
import com.resteam.smartway.repository.MenuItemCategoryRepository;
import com.resteam.smartway.repository.MenuItemRepository;
import com.resteam.smartway.security.SecurityUtils;
import com.resteam.smartway.security.multitenancy.context.RestaurantContext;
import com.resteam.smartway.service.aws.S3Service;
import com.resteam.smartway.service.dto.IsActiveUpdateDTO;
import com.resteam.smartway.service.dto.MenuItemDTO;
import com.resteam.smartway.service.mapper.MenuItemMapper;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
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

    private static final String ENTITY_NAME = "menu_item";

    private final MenuItemRepository menuItemRepository;

    private final S3Service s3Service;

    private final MenuItemMapper menuItemMapper;

    private final MenuItemCategoryRepository menuItemCategoryRepository;

    private final int COUNT_ROW_IMPORT = 0;

    @Override
    public Page<MenuItemDTO> loadMenuItemsWithSearch(Pageable pageable, String searchText, List<String> categoryIds, Boolean isActive) {
        if (searchText != null) searchText = searchText.toLowerCase();
        List<UUID> categoryUuidList = null;
        if (categoryIds != null && categoryIds.size() > 0) categoryUuidList =
            categoryIds.stream().map(UUID::fromString).collect(Collectors.toList());
        Page<MenuItem> menuItemPage = menuItemRepository.findWithFilterParams(searchText, categoryUuidList, isActive, pageable);

        return menuItemPage.map(item -> {
            MenuItemDTO menuItem = menuItemMapper.toDto(item);
            if (item.getImageKey() != null) {
                String imageUrl = s3Service.getDownloadUrl(item.getImageKey());
                menuItem.setImageUrl(imageUrl);
            } else menuItem.setImageUrl("");
            return menuItem;
        });
    }

    @Override
    @SneakyThrows
    public MenuItemDTO createMenuItem(@Valid MenuItemDTO menuItemDTO, MultipartFile imageSource) {
        MenuItem menuItem = menuItemMapper.toEntity(menuItemDTO);
        String menuItemCode = generateCode();

        if (imageSource != null) {
            String path = String.format("%s/menu-items/%s", RestaurantContext.getCurrentRestaurant().getId(), menuItemCode);
            s3Service.uploadImage(imageSource, path);
            menuItem.setImageKey(path);
        }
        if (menuItemDTO.getMenuItemCategory() != null) {
            UUID menuItemCategoryId = menuItemDTO.getMenuItemCategory().getId();
            MenuItemCategory menuItemCategory = menuItemCategoryRepository
                .findById(menuItemCategoryId)
                .orElseThrow(() -> new BadRequestAlertException("Category is not found", ENTITY_NAME, "idnotfound"));
            menuItem.setMenuItemCategory(menuItemCategory);
        }
        menuItem.setCode(menuItemCode);

        return menuItemMapper.toDto(menuItemRepository.save(menuItem));
    }

    private String generateCode() {
        Optional<MenuItem> lastMenuItem = menuItemRepository.findTopByOrderByCodeDesc();

        if (lastMenuItem.isEmpty()) return "MI000001"; else {
            String lastCode = lastMenuItem.get().getCode();
            int nextCodeInt = Integer.parseInt(lastCode.substring(2)) + 1;
            if (nextCodeInt > 999999) throw new IllegalStateException("Maximum Code reached");
            return String.format("MI%06d", nextCodeInt);
        }
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
                                String menuItemCode = generateCode();
                                menuItem.setIsActive(Boolean.TRUE);
                                menuItem.setIsInStock(Boolean.TRUE);
                                menuItem.setCode(menuItemCode);
                                Optional<MenuItemCategory> menuItemCategoryCurrent = menuItemCategoryRepository.findOneByName(
                                    cell.getStringCellValue()
                                );
                                if (menuItemCategoryCurrent.isPresent()) {
                                    MenuItemCategory menuItemCategory = menuItemCategoryCurrent.get();
                                    menuItem.setMenuItemCategory(menuItemCategory);
                                } else {
                                    MenuItemCategory newMenuItemCategory = new MenuItemCategory(null, cell.getStringCellValue());
                                    menuItemCategoryRepository.save(newMenuItemCategory);
                                    menuItem.setMenuItemCategory(newMenuItemCategory);
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
        List<MenuItem> menuItemList = menuItemRepository.findAllBy();
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

    private boolean validateNumericCellValue(Cell cell, int cellIndex) {
        if (cell.getCellType() != CellType.NUMERIC) {
            return false;
        }
        return true;
    }

    @Override
    @SneakyThrows
    public MenuItemDTO updateMenuItem(MenuItemDTO menuItemDTO, MultipartFile imageSource) {
        MenuItem menuItem = menuItemRepository
            .findById(menuItemDTO.getId())
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));

        if (imageSource != null) {
            if (menuItem.getImageKey() != null) {
                s3Service.deleteFile(menuItem.getImageKey());
                s3Service.uploadImage(imageSource, menuItem.getImageKey());
            } else {
                String path = String.format("%s/menu-items/%s", RestaurantContext.getCurrentRestaurant().getId(), menuItem.getCode());
                s3Service.uploadImage(imageSource, path);
                menuItem.setImageKey(path);
            }
        }
        if (menuItemDTO.getMenuItemCategory() != null) {
            UUID menuItemCategoryId = menuItemDTO.getMenuItemCategory().getId();
            MenuItemCategory menuItemCategory = menuItemCategoryRepository
                .findById(menuItemCategoryId)
                .orElseThrow(() -> new BadRequestAlertException("Category is not found", ENTITY_NAME, "idnotfound"));
            menuItem.setMenuItemCategory(menuItemCategory);
        }
        menuItemMapper.partialUpdate(menuItem, menuItemDTO);
        if (menuItemDTO.getImageUrl() == null || menuItemDTO.getImageUrl().isEmpty()) {
            s3Service.deleteFile(menuItem.getImageKey());
            menuItem.setImageKey(null);
        } else menuItem.setImageUrl(null);

        MenuItem result = menuItemRepository.save(menuItem);
        return menuItemMapper.toDto(result);
    }

    @Override
    public void deleteMenuItem(List<String> ids) {
        List<MenuItem> menuItemIdList = ids
            .stream()
            .map(id -> {
                if (id == null) throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
                return menuItemRepository
                    .findById(UUID.fromString(id))
                    .orElseThrow(() -> new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idnotfound"));
            })
            .collect(Collectors.toList());
        menuItemRepository.deleteAll(menuItemIdList);
    }

    @Override
    public void updateIsActiveMenuItems(IsActiveUpdateDTO isActiveUpdateDTO) {
        List<MenuItem> menuItemList = isActiveUpdateDTO
            .getIds()
            .stream()
            .map(id -> {
                if (id == null) throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
                MenuItem menuItem = menuItemRepository
                    .findById(UUID.fromString(id))
                    .orElseThrow(() -> new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idnotfound"));
                menuItem.setIsActive(isActiveUpdateDTO.getIsActive());
                return menuItem;
            })
            .collect(Collectors.toList());
        menuItemRepository.saveAll(menuItemList);
    }

    public MenuItemDTO getMenuItemById(UUID menuItemId) {
        MenuItem menuItem = menuItemRepository
            .findById(menuItemId)
            .orElseThrow(() -> new NotFoundException("Menu item not found with ID: " + menuItemId));

        return menuItemMapper.toDto(menuItem);
    }
}
