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
    //    private final ZoneRepository zoneRepository;
    //
    //    public ZoneService(ZoneRepository zoneRepository) {
    //        this.zoneRepository = zoneRepository;
    //    }
    //
    //    public Zone createZone(Zone zone) {
    //        return zoneRepository.save(zone);
    //    }
    //
    //    public Optional<Zone> getZoneById(UUID zoneId) {
    //        return zoneRepository.findById(zoneId);
    //    }
    //
    //    public Zone getZoneByID(UUID id) {
    //        Optional<Zone> optionalZone = zoneRepository.findById(id);
    //        return optionalZone.get();
    //    }
    //
    //    public List<Zone> getAllZone() {
    //        return zoneRepository.findAll();
    //    }
    //
    //    public void updateZone(UUID zoneId, Zone updatedZone) {
    //        zoneRepository.save(updatedZone);
    //    }
    //
    //    public void deleteZone(UUID zoneId) {
    //        zoneRepository.deleteById(zoneId);
    //    }

    List<ZoneDTO> loadAllZones();

    @SneakyThrows
    ZoneDTO createZone(@RequestBody ZoneDTO zoneDTO);

    ZoneDTO updateZone(ZoneDTO zoneDTO);

    void deleteZone(UUID id);
}
