package com.resteam.smartway.service;

import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.repository.RestaurantRepository;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    public RestaurantService(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }
    //    public String getRestaurantName(String restaurantName) {
    //        Optional<Restaurant> currentRestaurant = restaurantRepository.findOneByName(restaurantName);
    //        return currentRestaurant.get().getName();
    //    }
}
