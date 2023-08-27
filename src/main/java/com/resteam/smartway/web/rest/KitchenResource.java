package com.resteam.smartway.web.rest;

import com.resteam.smartway.security.multitenancy.annotation.RestaurantRestricted;
import com.resteam.smartway.service.KitchenService;
import com.resteam.smartway.service.dto.order.KitchenItemsDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Log4j2
@RestController
@RequestMapping("/api/kitchen")
@Transactional
@RequiredArgsConstructor
public class KitchenResource {

    private final KitchenService kitchenService;

    @GetMapping("/active-items")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERMISSION_KITCHEN_PREPARING_ITEM')")
    @RestaurantRestricted
    public ResponseEntity<KitchenItemsDTO> getAllUncompletedOrder() {
        return ResponseEntity.ok(kitchenService.getAllOrderItemInKitchen());
    }
}
