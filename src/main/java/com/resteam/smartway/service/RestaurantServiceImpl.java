package com.resteam.smartway.service;

import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.domain.User;
import com.resteam.smartway.repository.RestaurantRepository;
import com.resteam.smartway.repository.UserRepository;
import com.resteam.smartway.security.multitenancy.context.RestaurantContext;
import com.resteam.smartway.service.dto.IsActiveUpdateDTO;
import com.resteam.smartway.service.dto.RestaurantDTO;
import com.resteam.smartway.service.mapper.RestaurantMapper;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class RestaurantServiceImpl implements RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;
    private final RestaurantMapper restaurantMapper;
    private final String ENTITY_RESTAURANT = "restaurant";

    @Autowired
    private EmailService emailService;

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

    @Scheduled(cron = "0 0 0 * * ?")
    public void schedulePlanExpiryEmails() {
        checkPlanExpiryAndSendEmails();
    }

    public void checkPlanExpiryAndSendEmails() {
        List<Restaurant> restaurants = restaurantRepository.findAll();
        Instant today = Instant.now();
        LocalDate todayDate = today.atZone(ZoneId.systemDefault()).toLocalDate();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        LocalDate expiryThreshold = todayDate.plusDays(5);
        String formattedExpiryThreshold = expiryThreshold.format(dateFormatter);
        for (Restaurant restaurant : restaurants) {
            if (!"system@".equals(restaurant.getId())) {
                Instant planExpiry = restaurant.getPlanExpiry();
                if (planExpiry != null) {
                    LocalDate expiryDate = planExpiry.atZone(ZoneId.systemDefault()).toLocalDate();
                    String formattedExpiry = expiryDate.format(dateFormatter);

                    if (formattedExpiryThreshold.equals(formattedExpiry)) {
                        User user = userRepository.findUserByRestaurantId(restaurant.getId());
                        if (user != null && "ADMIN".equals(user.getRole().getName())) {
                            String mailTo = user.getEmail();
                            String subject = "Your plan is expiring soon!";
                            String message = "Your plan will expire on " + formattedExpiry + ". Please renew your plan.";

                            emailService.sendMail(mailTo, subject, message);
                        }
                    }
                }
            }
        }
    }

    @Override
    public RestaurantDTO getRestaurantInfo() {
        Restaurant restaurant = restaurantRepository
            .findOneById(RestaurantContext.getCurrentRestaurant().getId())
            .orElseThrow(() -> new BadRequestAlertException("Restaurant not found", "restaurant", "idnotfound"));
        return restaurantMapper.toDto(restaurant);
    }

    @Override
    public RestaurantDTO updateRestaurantInformation(RestaurantDTO dto) {
        Restaurant restaurant = restaurantRepository
            .findOneById(RestaurantContext.getCurrentRestaurant().getId())
            .orElseThrow(() -> new BadRequestAlertException("Restaurant not found", "restaurant", "idnotfound"));
        restaurant.setPhone(dto.getPhone());
        restaurant.setCurrencyUnit(dto.getCurrencyUnit());
        restaurant.setName(dto.getName());
        restaurant.setAddress(dto.getAddress());
        restaurant.setIsNew(false);

        return restaurantMapper.toDto(restaurantRepository.save(restaurant));
    }

    @Override
    public Page<RestaurantDTO> loadRestaurantWithSearch(Pageable pageable, String searchText, Boolean isActive) {
        if (searchText != null) {
            if (searchText.isEmpty()) searchText = null; else searchText = searchText.toLowerCase();
        }
        Page<Restaurant> restaurantPage = restaurantRepository.findWithFilterParams(searchText, isActive, pageable);
        List<Restaurant> restaurantList = restaurantPage
            .getContent()
            .stream()
            .filter(dto -> !dto.getId().equals("admin"))
            .collect(Collectors.toList());
        List<RestaurantDTO> restaurantDTOList = restaurantList.stream().map(restaurantMapper::toDto).collect(Collectors.toList());
        return new PageImpl<>(restaurantDTOList, pageable, restaurantPage.getTotalElements());
    }

    @Override
    public void updateIsActiveRestaurant(IsActiveUpdateDTO isActiveUpdateDTO) {
        List<Restaurant> restaurantList = isActiveUpdateDTO
            .getIds()
            .stream()
            .map(id -> {
                if (id == null) throw new BadRequestAlertException("Invalid", ENTITY_RESTAURANT, "idnull");
                Restaurant restaurant = restaurantRepository
                    .findById(id)
                    .orElseThrow(() -> new BadRequestAlertException("Invalid ID", ENTITY_RESTAURANT, "idnotfound"));
                restaurant.setIsActive(isActiveUpdateDTO.getIsActive());
                return restaurant;
            })
            .collect(Collectors.toList());
        restaurantRepository.saveAll(restaurantList);
    }
}
