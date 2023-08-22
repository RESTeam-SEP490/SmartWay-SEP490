package com.resteam.smartway.service;

import com.resteam.smartway.service.dto.IsActiveUpdateDTO;
import com.resteam.smartway.service.dto.RestaurantDTO;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RestaurantService {
    Page<RestaurantDTO> loadRestaurantWithSearch(Pageable pageable, String searchText, Boolean isActive);

    RestaurantDTO getRestaurantInfo();

    List<RestaurantDTO> getAllRestaurantDTOs();

    void updateIsActiveRestaurant(IsActiveUpdateDTO isActiveUpdateDTO);
}
