package com.resteam.smartway.service;

import com.resteam.smartway.service.dto.ZoneDTO;
import java.util.List;
import java.util.UUID;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

@Service
@Transactional
public interface ZoneService {
    List<ZoneDTO> loadAllZones();

    @SneakyThrows
    ZoneDTO createZone(@RequestBody ZoneDTO zoneDTO);

    ZoneDTO updateZone(ZoneDTO zoneDTO);

    void deleteZone(UUID id);
}
