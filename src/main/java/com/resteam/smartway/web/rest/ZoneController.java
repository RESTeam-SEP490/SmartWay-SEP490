package com.resteam.smartway.web.rest;

import com.resteam.smartway.domain.Zone;
import com.resteam.smartway.service.ZoneService;
import java.util.UUID;
import javax.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/zone")
public class ZoneController {

    private final ZoneService zoneService;

    public ZoneController(ZoneService zoneService) {
        this.zoneService = zoneService;
    }

    @PostMapping
    public ResponseEntity<Zone> createZone(@Valid @RequestBody Zone zone) {
        Zone createdZone = zoneService.createZone(zone);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdZone);
    }

    @GetMapping("/{zoneId}")
    public ResponseEntity<Zone> getZone(@PathVariable UUID zoneId) {
        return zoneService.getZoneById(zoneId).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<Page<Zone>> getAllZones() {
        Page<Zone> zones = (Page<Zone>) zoneService.getAllZone();
        return ResponseEntity.ok(zones);
    }

    @PutMapping("/{zoneId}")
    public ResponseEntity<Void> updateZone(@PathVariable UUID zoneId, @Validated @RequestBody Zone updatedzone) {
        zoneService.updateZone(zoneId, updatedzone);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{zoneId}")
    public ResponseEntity<Void> deleteZone(@PathVariable UUID zoneId) {
        zoneService.deleteZone(zoneId);
        return ResponseEntity.noContent().build();
    }
}
