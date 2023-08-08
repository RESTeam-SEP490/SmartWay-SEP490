package com.resteam.smartway.service;

import com.amazonaws.services.kms.model.NotFoundException;
import com.resteam.smartway.domain.MenuItem;
import com.resteam.smartway.domain.MenuItemCategory;
import com.resteam.smartway.repository.MenuItemCategoryRepository;
import com.resteam.smartway.repository.MenuItemRepository;
import com.resteam.smartway.security.multitenancy.context.RestaurantContext;
import com.resteam.smartway.service.aws.S3Service;
import com.resteam.smartway.service.dto.IsActiveUpdateDTO;
import com.resteam.smartway.service.dto.MenuItemDTO;
import com.resteam.smartway.service.mapper.MenuItemMapper;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.io.InputStream;
import java.text.DecimalFormat;
import java.util.*;
import java.util.regex.Pattern;
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

    private final String NAME_SHEET_SECRET_KEY = "Secret_Key";
    private final String NAME_SHEET_MENU_ITEM = "Menu_Item";
    private final String REGEX_CATEGORY_NAME = "^.{1,30}$";
    private final String MESSAGE_CATEGORY_NAME = "menuItem.categoryName";
    private final String REGEX_ITEM_NAME = "^.{1,100}$";
    private final String MESSAGE_ITEM_NAME = "menuItem.regexItemName";
    private final String REGEX_DES = "^.{1,255}$";
    private final String MESSAGE_DES = "menuItem.regexDes";
    private final String INVALID_PRICE = "menuItem.invalidPrice";
    private final String CONTENT_KEY_COLUMN_EMPTY = "menuItem.columnEmpty";
    private static final String SECRET_KEY_ENCRYPT = "lUcV6iYbiEtmXQze5RQf92eJLeJe6LPOFwgP0YRBwJc=";

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

    public Map<String, String> importMenuItems(InputStream is) {
        Map<String, String> errorMap = new HashMap<>();
        List<MenuItem> menuItemList = new ArrayList<>();
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
                errorMap.put("menuItem.nullSecretKey", "");
                return errorMap;
            }

            if (checkSecretKey(secretKeyInFile)) {
                XSSFSheet sheet = workbook.getSheet(NAME_SHEET_MENU_ITEM);
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
                    MenuItem menuItem = new MenuItem();
                    boolean isRoleEmpty = false;
                    DecimalFormat decimalFormat = new DecimalFormat("#");
                    boolean isCheckAllEmptyOrNull = false;
                    boolean isCheckBasePrice = false;
                    boolean isCheckSellingPrice = false;
                    List<String> keysToRemove = new ArrayList<>();
                    String menuItemCode = null;
                    while (cells.hasNext()) {
                        Cell cell = cells.next();

                        switch (cell.getColumnIndex()) {
                            case 0:
                                if (cell.getCellType() == CellType.NUMERIC) {
                                    double categoryNumeric = cell.getNumericCellValue();
                                    String categoryString = decimalFormat.format(categoryNumeric);
                                    if (categoryString != null) {
                                        Optional<MenuItemCategory> menuItemCategoryCurrent = menuItemCategoryRepository.findOneByName(
                                            categoryString
                                        );
                                        if (menuItemCategoryCurrent.isPresent()) {
                                            MenuItemCategory menuItemCategory = menuItemCategoryCurrent.get();
                                            menuItem.setMenuItemCategory(menuItemCategory);
                                        } else {
                                            MenuItemCategory newMenuItemCategory = new MenuItemCategory(null, categoryString);
                                            menuItemCategoryRepository.save(newMenuItemCategory);
                                            menuItem.setMenuItemCategory(newMenuItemCategory);
                                        }
                                    }
                                } else {
                                    if (cell.getStringCellValue() == null || cell.getStringCellValue().equals("")) {} else {
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
                                }
                                break;
                            case 1:
                                if (cell.getCellType() == CellType.NUMERIC) {
                                    double itemNameNumeric = cell.getNumericCellValue();
                                    String itemNameString = decimalFormat.format(itemNameNumeric);
                                    menuItem.setName(itemNameString);
                                } else {
                                    menuItem.setName(cell.getStringCellValue());
                                }
                                break;
                            case 2:
                                if (cell.getCellType() == CellType.NUMERIC) {
                                    double desNumeric = cell.getNumericCellValue();
                                    String desString = decimalFormat.format(desNumeric);
                                    menuItem.setDescription(desString);
                                } else {
                                    menuItem.setDescription(cell.getStringCellValue());
                                }
                                break;
                            case 3:
                                isCheckBasePrice = true;
                                if (
                                    cell.getCellType() != CellType.NUMERIC &&
                                    (cell.getStringCellValue() != null && !cell.getStringCellValue().equals(""))
                                ) {
                                    StringBuilder columnName = new StringBuilder(getColumnLabel(4));
                                    errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), INVALID_PRICE);
                                    keysToRemove.add(getColumnLabel(4) + (rowNumber + 1));
                                } else {
                                    if (cell.getNumericCellValue() != 0.0) {
                                        menuItem.setBasePrice(cell.getNumericCellValue());
                                    } else {
                                        StringBuilder columnName = new StringBuilder(getColumnLabel(4));
                                        errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), CONTENT_KEY_COLUMN_EMPTY);
                                        keysToRemove.add(getColumnLabel(4) + (rowNumber + 1));
                                        noUpload = true;
                                    }
                                }
                                break;
                            case 4:
                                isCheckSellingPrice = true;
                                if (
                                    cell.getCellType() != CellType.NUMERIC &&
                                    (cell.getStringCellValue() != null && !cell.getStringCellValue().equals(""))
                                ) {
                                    StringBuilder columnName = new StringBuilder(getColumnLabel(5));
                                    errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), INVALID_PRICE);
                                    keysToRemove.add(getColumnLabel(5) + (rowNumber + 1));
                                } else {
                                    if (cell.getNumericCellValue() != 0.0) {
                                        menuItem.setSellPrice(cell.getNumericCellValue());
                                    } else {
                                        StringBuilder columnName = new StringBuilder(getColumnLabel(5));
                                        errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), CONTENT_KEY_COLUMN_EMPTY);
                                        keysToRemove.add(getColumnLabel(5) + (rowNumber + 1));
                                        noUpload = true;
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                    }

                    boolean isValidated = true;

                    if (menuItem.getMenuItemCategory() == null) {
                        isValidated = false;
                        StringBuilder columnName = new StringBuilder(getColumnLabel(1));
                        errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), CONTENT_KEY_COLUMN_EMPTY);
                        keysToRemove.add(getColumnLabel(1) + (rowNumber + 1));
                        noUpload = true;
                    } else {
                        if (!Pattern.matches(REGEX_CATEGORY_NAME, menuItem.getMenuItemCategory().getName())) {
                            noUpload = true;
                            StringBuilder columnName = new StringBuilder(getColumnLabel(1));
                            errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), MESSAGE_CATEGORY_NAME);
                            keysToRemove.add(getColumnLabel(1) + (rowNumber + 1));
                        }
                    }

                    if (menuItem.getName() == null || menuItem.getName().equals("")) {
                        isValidated = false;
                        StringBuilder columnName = new StringBuilder(getColumnLabel(2));
                        errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), CONTENT_KEY_COLUMN_EMPTY);
                        keysToRemove.add(getColumnLabel(2) + (rowNumber + 1));
                        noUpload = true;
                    } else {
                        if (!Pattern.matches(REGEX_ITEM_NAME, menuItem.getName())) {
                            noUpload = true;
                            StringBuilder columnName = new StringBuilder(getColumnLabel(2));
                            errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), MESSAGE_ITEM_NAME);
                            keysToRemove.add(getColumnLabel(2) + (rowNumber + 1));
                        }
                    }

                    if (menuItem.getDescription() == null || menuItem.getDescription().equals("")) {
                        isValidated = false;
                        StringBuilder columnName = new StringBuilder(getColumnLabel(3));
                        errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), CONTENT_KEY_COLUMN_EMPTY);
                        keysToRemove.add(getColumnLabel(3) + (rowNumber + 1));
                        noUpload = true;
                    } else {
                        if (!Pattern.matches(REGEX_DES, menuItem.getDescription())) {
                            noUpload = true;
                            StringBuilder columnName = new StringBuilder(getColumnLabel(3));
                            errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), MESSAGE_DES);
                            keysToRemove.add(getColumnLabel(3) + (rowNumber + 1));
                        }
                    }

                    if ((menuItem.getBasePrice() == null || menuItem.getBasePrice() == 0.0) && !isCheckBasePrice) {
                        isValidated = false;
                        StringBuilder columnName = new StringBuilder(getColumnLabel(4));
                        errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), CONTENT_KEY_COLUMN_EMPTY);
                        keysToRemove.add(getColumnLabel(4) + (rowNumber + 1));
                        noUpload = true;
                    }

                    if ((menuItem.getSellPrice() == null || menuItem.getSellPrice() == 0.0) && !isCheckSellingPrice) {
                        isValidated = false;
                        StringBuilder columnName = new StringBuilder(getColumnLabel(5));
                        errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), CONTENT_KEY_COLUMN_EMPTY);
                        keysToRemove.add(getColumnLabel(5) + (rowNumber + 1));
                        noUpload = true;
                    }

                    if (
                        (menuItem.getMenuItemCategory() == null) &&
                        (menuItem.getName() == null || menuItem.getName().equals("")) &&
                        (menuItem.getDescription() == null || menuItem.getDescription().equals("")) &&
                        (menuItem.getBasePrice() == null || menuItem.getBasePrice().equals(0.0)) &&
                        (menuItem.getSellPrice() == null || menuItem.getSellPrice().equals(0.0))
                    ) {
                        for (String key : keysToRemove) {
                            errorMap.remove(key);
                        }
                        isCheckAllEmptyOrNull = true;
                    }

                    if (isCheckAllEmptyOrNull) {
                        if (errorMap.isEmpty() && menuItemList.isEmpty()) {
                            errorMap.put("Menu-Item.xlsx", "menuItem.emptyFileName");
                        } else {
                            noUpload = false;
                        }
                        break;
                    }

                    if (isValidated) {
                        menuItem.setIsActive(Boolean.TRUE);
                        menuItem.setIsInStock(Boolean.TRUE);

                        menuItemList.add(menuItem);
                    }

                    rowNumber++;
                }

                if (menuItemList.isEmpty()) {
                    errorMap.put("Menu-Item.xlsx", "menuItem.emptyFileName");
                }

                if (!noUpload) {
                    if (menuItemList.isEmpty()) {
                        errorMap.put("Menu-Item.xlsx", "menuItem.emptyFileName");
                    } else {
                        for (MenuItem mi : menuItemList) {
                            String menuItemCode = generateCode();
                            mi.setCode(menuItemCode);
                            createMenuItem(menuItemMapper.toDto(mi), null);
                        }
                    }
                }
            } else {
                errorMap.put("menuItem.invalidSecretKey", "");
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
