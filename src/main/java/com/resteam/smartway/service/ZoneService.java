package com.resteam.smartway.service;

import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.domain.Zone;
import com.resteam.smartway.repository.ZoneRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ZoneService {

    private final ZoneRepository zoneRepository;

    public ZoneService(ZoneRepository zoneRepository) {
        this.zoneRepository = zoneRepository;
    }

    public Zone createZone(Zone zone) {
        return zoneRepository.save(zone);
    }

    public Optional<Zone> getZoneById(UUID zoneId) {
        return zoneRepository.findById(zoneId);
    }

    public Zone getZoneByID(UUID id) {
        Optional<Zone> optionalZone = zoneRepository.findById(id);
        return optionalZone.get();
    }

    public List<Zone> getAllZone() {
        return zoneRepository.findAll();
    }

    public void updateZone(UUID zoneId, Zone updatedZone) {
        zoneRepository.save(updatedZone);
    }

    public void deleteZone(UUID zoneId) {
        zoneRepository.deleteById(zoneId);
    }
}
