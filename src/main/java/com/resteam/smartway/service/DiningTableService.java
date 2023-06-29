package com.resteam.smartway.service;

import com.resteam.smartway.domain.DiningTable;
import com.resteam.smartway.repository.DiningTableRepository;
import com.resteam.smartway.repository.ZoneRepository;
import com.resteam.smartway.service.dto.DiningTableDTO;
import com.resteam.smartway.service.mapper.DiningTableMapper;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class DiningTableService {

    private final DiningTableRepository diningTableRepository;

    private final ZoneService zoneService;

    private final ZoneRepository zoneRepository;
    private final DiningTableMapper diningTableMapper;

    public DiningTableService(
        DiningTableRepository diningTableRepository,
        ZoneService zoneService,
        ZoneService zoneService1,
        ZoneRepository zoneRepository,
        DiningTableMapper diningTableMapper
    ) {
        this.diningTableRepository = diningTableRepository;
        this.zoneService = zoneService1;
        this.zoneRepository = zoneRepository;
        this.diningTableMapper = diningTableMapper;
    }

    public List<DiningTableDTO> getAllDiningTables() {
        List<DiningTable> diningTables = (List<DiningTable>) diningTableRepository.findAll();
        return diningTables.stream().map(diningTableMapper::toDto).collect(Collectors.toList());
    }

    public Optional<DiningTableDTO> getDiningTableById(UUID id) {
        Optional<DiningTable> diningTableOptional = diningTableRepository.findById(id);
        return diningTableOptional.map(diningTableMapper::toDto);
    }

    public DiningTableDTO createDiningTable(DiningTableDTO diningTableDTO) {
        DiningTable diningTable = diningTableMapper.toEntity(diningTableDTO);
        DiningTable savedDiningTable = diningTableRepository.save(diningTable);
        return diningTableMapper.toDto(savedDiningTable);
    }

    public DiningTableDTO updateDiningTable(DiningTableDTO diningTableDTO) {
        //        return Optional
        //            .of(diningTableRepository.findById(diningTableDTO.getId()))
        //            .filter(Optional::isPresent)
        //            .map(Optional::get)
        //            .map(diningTable -> {
        //                diningTable.setName(diningTableDTO.getName());
        //                diningTable.setStatus(diningTableDTO.getStatus());
        //                diningTable.setZone(zoneService.getZoneByID(diningTableDTO.getZoneId()));
        //
        //            })
        DiningTable diningTable = diningTableRepository
            .findById(diningTableDTO.getId())
            .orElseThrow(() -> new EntityNotFoundException("Dining Table not found"));

        diningTable.setName(diningTableDTO.getName());
        diningTable.setStatus(diningTableDTO.getStatus());
        diningTable.setZone(zoneService.getZoneByID(diningTableDTO.getZoneId()));

        DiningTable updatedDiningTable = diningTableRepository.save(diningTable);
        return diningTableMapper.toDto(updatedDiningTable);
    }

    public void deleteDiningTable(UUID id) {
        DiningTable diningTable = diningTableRepository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Dining Table not found"));

        diningTableRepository.delete(diningTable);
    }
}
