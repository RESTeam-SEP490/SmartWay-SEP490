package com.resteam.smartway.service;

import com.resteam.smartway.service.dto.DiningTableDTO;
import com.resteam.smartway.service.dto.IsActiveUpdateDTO;
import java.util.List;
import lombok.SneakyThrows;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DiningTableService {
    Page<DiningTableDTO> loadDiningTablesWithSearch(Pageable pageable, String searchText, List<String> zoneIds, Boolean isActive);

    @SneakyThrows
    DiningTableDTO createDiningTable(DiningTableDTO diningTableDTO);

    DiningTableDTO updateDiningTable(DiningTableDTO diningTableDTO);

    void deleteDiningTable(List<String> ids);

    void updateIsActiveDiningTables(IsActiveUpdateDTO isActiveUpdateDTO);
}
