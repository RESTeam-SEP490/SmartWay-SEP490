package com.resteam.smartway.web.rest;

import com.resteam.smartway.repository.RestaurantRepository;
import com.resteam.smartway.service.RestaurantService;
import com.resteam.smartway.service.RestaurantServiceImpl;
import com.resteam.smartway.service.dto.RestaurantDTO;
import java.util.List;
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

    private final RestaurantService restaurantService;

    private final RestaurantServiceImpl restaurantServiceImpl;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    @GetMapping("/restaurant")
    public ResponseEntity<RestaurantDTO> getCurrentRestaurant() {
        return ResponseEntity.ok(restaurantService.getRestaurantInfo());
    }

    @PutMapping("/restaurant")
    public ResponseEntity<RestaurantDTO> updateCurrentRestaurant(@Valid @RequestBody RestaurantDTO dto) {
        return ResponseEntity.ok(restaurantService.updateRestaurantInformation(dto));
    }

    @GetMapping("/manage-restaurants")
    public ResponseEntity<List<RestaurantDTO>> getListRestaurants() {
        List<RestaurantDTO> restaurantDTOs = restaurantService.getAllRestaurantDTOs();
        return ResponseEntity.ok(restaurantDTOs);
    }

    @GetMapping("/check-plan-expiry")
    public ResponseEntity<String> checkPlanExpiryAndSendEmailsNow() {
        restaurantServiceImpl.checkPlanExpiryAndSendEmails();
        return ResponseEntity.ok("Email check and sending triggered.");
    }
}
