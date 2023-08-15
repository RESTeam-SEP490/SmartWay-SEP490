package com.resteam.smartway.web.rest;

import com.resteam.smartway.service.RestaurantService;
import com.resteam.smartway.service.dto.RestaurantDTO;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.PaginationUtil;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminResource {

    private final RestaurantService restaurantService;

    @GetMapping("/restaurant")
    public ResponseEntity<List<RestaurantDTO>> loadDiningTableWithSearch(
        Pageable pageable,
        @RequestParam(value = "search", required = false) String searchText
    ) {
        Page<RestaurantDTO> restaurantDTOPage = restaurantService.loadRestaurantWithSearch(pageable, searchText);
        List<RestaurantDTO> filteredRestaurantDTO = restaurantDTOPage
            .getContent()
            .stream()
            .filter(dto -> !dto.getId().equals("system@"))
            .collect(Collectors.toList());
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(
            ServletUriComponentsBuilder.fromCurrentRequest(),
            new PageImpl<>(filteredRestaurantDTO, pageable, filteredRestaurantDTO.size())
        );
        return new ResponseEntity<>(filteredRestaurantDTO, headers, HttpStatus.OK);
    }
}
