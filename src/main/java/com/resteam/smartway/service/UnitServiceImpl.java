package com.resteam.smartway.service;

import com.resteam.smartway.domain.Unit;
import com.resteam.smartway.repository.UnitRepository;
import com.resteam.smartway.service.dto.UnitDTO;
import com.resteam.smartway.service.mapper.UnitMapper;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class UnitServiceImpl implements UnitService {

    private final UnitRepository unitRepository;
    private final UnitMapper unitMapper;

    private static final String ENTITY_NAME = "unit";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    @Override
    public List<UnitDTO> loadAllUnit() {
        List<Unit> unitList = unitRepository.findAllByOrderByCreatedDateDesc();
        return unitMapper.toDto(unitList);
    }

    @Override
    public UnitDTO createUnit(UnitDTO unitDTO) {
        unitRepository
            .findOneByName(unitDTO.getName())
            .ifPresent(unit -> {
                throw new BadRequestAlertException(applicationName, ENTITY_NAME, "existed");
            });
        Unit unit = unitMapper.toEntity(unitDTO);
        return unitMapper.toDto(unitRepository.save(unit));
    }

    @Override
    public UnitDTO updateUnit(UnitDTO unitDTO) {
        Unit unit = unitRepository
            .findById(unitDTO.getId())
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
        unit.setName(unitDTO.getName());
        Unit result = unitRepository.save(unit);
        return unitMapper.toDto(result);
    }

    @Override
    public void deleteUnit(UUID id) {
        unitRepository.findById(id).ifPresent(unitRepository::delete);
    }
}
