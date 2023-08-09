package com.resteam.smartway.web.rest;

import com.resteam.smartway.service.RestaurantService;
import com.resteam.smartway.service.dto.RestaurantDTO;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@Transactional
public class RestaurantResource {

    private static final String ENTITY_NAME = "restaurant";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RestaurantService restaurantService;

    @GetMapping("/restaurant")
    public ResponseEntity<RestaurantDTO> getCurrentRestaurant() {
        return ResponseEntity.ok(restaurantService.getRestaurantInfo());
    }

    @PostMapping("/restaurant")
    public ResponseEntity<RestaurantDTO> updateCurrentRestaurant(@Valid @RequestBody RestaurantDTO dto) {
        return ResponseEntity.ok(restaurantService.getRestaurantInfo());
    }
}
