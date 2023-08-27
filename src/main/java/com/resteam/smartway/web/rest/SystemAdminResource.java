package com.resteam.smartway.web.rest;

import com.resteam.smartway.service.RestaurantService;
import com.resteam.smartway.service.dto.IsActiveUpdateDTO;
import com.resteam.smartway.service.dto.RestaurantDTO;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/system-admin")
public class SystemAdminResource {

    private final RestaurantService restaurantService;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final String ENTITY_RESTAURANT = "restaurant";
    private final String LINK_DASHBOARD = "https://stripe.com/docs/development";

    @GetMapping("restaurant")
    public ResponseEntity<List<RestaurantDTO>> loadDiningTableWithSearch(
        Pageable pageable,
        @RequestParam(value = "search", required = false) String searchText,
        @RequestParam(value = "isActive", required = false) Boolean isActive
    ) {
        Page<RestaurantDTO> restaurantDTOPage = restaurantService.loadRestaurantWithSearch(pageable, searchText, isActive);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(
            ServletUriComponentsBuilder.fromCurrentRequest(),
            restaurantDTOPage
        );
        return new ResponseEntity<>(restaurantDTOPage.getContent(), headers, HttpStatus.OK);
    }

    @PutMapping("/restaurant")
    public ResponseEntity<RestaurantDTO> updateIsActiveRestaurant(@RequestBody IsActiveUpdateDTO isActiveUpdateDTO) {
        restaurantService.updateIsActiveRestaurant(isActiveUpdateDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_RESTAURANT, isActiveUpdateDTO.getIds().toString()))
            .build();
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ROLE_SYSTEM_ADMIN')")
    public ResponseEntity<String> dashboardSystemAdmin() {
        return ResponseEntity.status(HttpStatus.OK).body(LINK_DASHBOARD);
    }
}
