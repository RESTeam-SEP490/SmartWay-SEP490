package com.resteam.smartway.service;

import com.itextpdf.text.DocumentException;
import com.resteam.smartway.service.dto.DiningTableDTO;
import com.resteam.smartway.service.dto.IsActiveUpdateDTO;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
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

    Optional<DiningTableDTO> findById(UUID uuid);

    byte[] generatePdfForDiningTable(DiningTableDTO diningTableDTO) throws DocumentException;
}
