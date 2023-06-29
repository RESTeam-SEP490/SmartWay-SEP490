package com.resteam.smartway.web.rest;

import com.resteam.smartway.service.DiningTableService;
import com.resteam.smartway.service.dto.DiningTableDTO;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import javax.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/")
public class DiningTableController {

    private final DiningTableService diningTableService;

    public DiningTableController(DiningTableService diningTableService) {
        this.diningTableService = diningTableService;
    }

    @PostMapping("/dining-tables")
    public ResponseEntity<DiningTableDTO> createDiningTable(@RequestBody DiningTableDTO diningTableDTO) {
        DiningTableDTO createdDiningTable = diningTableService.createDiningTable(diningTableDTO);
        return ResponseEntity.ok(createdDiningTable);
    }

    @GetMapping("/dining-tables")
    public ResponseEntity<List<DiningTableDTO>> getAllDiningTables(HttpServletRequest request) {
        //        String restaurantIdHeader = request.getHeader("restaurantId");
        //        if (restaurantIdHeader == null) {
        //            throw new IllegalArgumentException("restaurantId header is missing");
        //        }

        //        UUID restaurantId = UUID.fromString(restaurantIdHeader);
        List<DiningTableDTO> diningTables = diningTableService.getAllDiningTables();
        return ResponseEntity.ok(diningTables);
    }

    @GetMapping("/dining-tables/{id}")
    public ResponseEntity<DiningTableDTO> getDiningTable(@PathVariable UUID id) {
        //        String restaurantIdHeader = request.getHeader("restaurantId");
        //        if (restaurantIdHeader == null) {
        //            throw new IllegalArgumentException("restaurantId header is missing");
        //        }
        //
        //        UUID restaurantId = UUID.fromString(restaurantIdHeader);
        Optional<DiningTableDTO> diningTable = diningTableService.getDiningTableById(id);
        return diningTable.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/dining-tables")
    public ResponseEntity<DiningTableDTO> updateDiningTable(HttpServletRequest request, @RequestBody DiningTableDTO diningTableDTO) {
        //        String restaurantIdHeader = request.getHeader("restaurantId");
        //        if (restaurantIdHeader == null) {
        //            throw new IllegalArgumentException("restaurantId header is missing");
        //        }
        //
        //        UUID restaurantId = UUID.fromString(restaurantIdHeader);
        //        diningTableDTO.setRestaurantId(restaurantId);

        if (diningTableDTO.getId() == null) {
            throw new IllegalArgumentException("DiningTable id must not be null for update operation");
        }
        DiningTableDTO updatedDiningTable = diningTableService.updateDiningTable(diningTableDTO);
        return ResponseEntity.ok(updatedDiningTable);
    }

    @DeleteMapping("/dining-tables/{id}")
    public ResponseEntity<Void> deleteDiningTable(HttpServletRequest request, @PathVariable UUID id) {
        String restaurantIdHeader = request.getHeader("restaurantId");
        //        if (restaurantIdHeader == null) {
        //            throw new IllegalArgumentException("restaurantId header is missing");
        //        }
        //
        //        UUID restaurantId = UUID.fromString(restaurantIdHeader);
        diningTableService.deleteDiningTable(id);
        return ResponseEntity.noContent().build();
    }
}
