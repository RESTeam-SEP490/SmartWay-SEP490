package com.resteam.smartway.service;

import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.domain.User;
import com.resteam.smartway.repository.RestaurantRepository;
import com.resteam.smartway.repository.UserRepository;
import com.resteam.smartway.service.dto.RestaurantDTO;
import java.util.List;
import java.util.stream.Collectors;
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
    private final UserRepository userRepository;
    private final UserService userService;

    @Override
    public List<RestaurantDTO> getAllRestaurantDTOs() {
        return restaurantRepository
            .findAll()
            .stream()
            .filter(restaurant -> !"system@".equals(restaurant.getId()))
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    private RestaurantDTO mapToDTO(Restaurant restaurant) {
        RestaurantDTO dto = new RestaurantDTO();
        dto.setId(restaurant.getId());
        dto.setName(restaurant.getName());
        dto.setPlanExpiry(restaurant.getPlanExpiry());
        User user = userRepository.findUserByRestaurantId(restaurant.getId());
        if ((user != null)) {
            if (user.getRole().getName().equals("ADMIN")) {
                dto.setFullName(user.getFullName());
                dto.setEmail(user.getEmail());
                dto.setPhone(user.getPhone());
            }
        }

        return dto;
    }
}
