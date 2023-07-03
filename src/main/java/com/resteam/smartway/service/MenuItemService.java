package com.resteam.smartway.service;

import com.resteam.smartway.service.dto.MenuItemDTO;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import javax.validation.Valid;
import lombok.SneakyThrows;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

public interface MenuItemService {
    Page<MenuItemDTO> loadMenuItemsWithSearch(Pageable pageable, String searchText, List<String> categoryIds);

    @SneakyThrows
    void createMenuItem(@Valid MenuItemDTO menuItemDTO, MultipartFile imageSource);

    ResponseEntity<?> convertExcelToListOfMenuItem(InputStream is);

    ByteArrayInputStream getListMenuItemsForExcel() throws IOException;
}
