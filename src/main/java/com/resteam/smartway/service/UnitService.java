package com.resteam.smartway.service;

import com.resteam.smartway.service.dto.UnitDTO;
import java.util.List;
import java.util.UUID;
import lombok.SneakyThrows;
import org.springframework.web.bind.annotation.RequestBody;

public interface UnitService {
    List<UnitDTO> loadAllUnit();

    @SneakyThrows
    UnitDTO createUnit(@RequestBody UnitDTO unitDTO);

    UnitDTO updateUnit(UnitDTO unitDTO);

    void deleteUnit(UUID id);
}
