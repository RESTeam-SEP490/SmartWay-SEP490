package com.resteam.smartway.service;

import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.repository.RestaurantRepository;
import com.resteam.smartway.security.multitenancy.context.RestaurantContext;
import com.resteam.smartway.service.dto.RestaurantDTO;
import com.resteam.smartway.service.mapper.RestaurantMapper;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class RestaurantServiceImpl implements RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final RestaurantMapper restaurantMapper;

    @Override
    public RestaurantDTO getRestaurantInfo() {
        Restaurant restaurant = restaurantRepository
            .findOneById(RestaurantContext.getCurrentRestaurant().getId())
            .orElseThrow(() -> new BadRequestAlertException("Restaurant not found", "restaurant", "idnotfound"));
        return restaurantMapper.toDto(restaurant);
    }
}
