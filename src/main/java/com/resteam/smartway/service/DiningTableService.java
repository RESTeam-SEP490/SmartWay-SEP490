package com.resteam.smartway.service;

import com.resteam.smartway.service.dto.DiningTableDTO;
import com.resteam.smartway.service.dto.MenuItemDTO;
import java.util.List;
import lombok.SneakyThrows;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface DiningTableService {
    Page<DiningTableDTO> loadDiningTablesWithSearch(Pageable pageable, String searchText, List<String> zoneIds);

    @SneakyThrows
    DiningTableDTO createDiningTable(DiningTableDTO diningTableDTO);

    DiningTableDTO updateDiningTable(DiningTableDTO diningTableDTO);
}
