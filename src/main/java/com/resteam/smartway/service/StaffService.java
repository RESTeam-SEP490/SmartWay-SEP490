package com.resteam.smartway.service;

import com.resteam.smartway.domain.Authority;
import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.domain.Role;
import com.resteam.smartway.domain.User;
import com.resteam.smartway.repository.AuthorityRepository;
import com.resteam.smartway.repository.RestaurantRepository;
import com.resteam.smartway.repository.RoleRepository;
import com.resteam.smartway.repository.StaffRepository;
import com.resteam.smartway.service.dto.StaffDTO;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class StaffService {

    private final Logger log = LoggerFactory.getLogger(StaffService.class);

    private final StaffRepository staffRepository;

    private final RestaurantRepository restaurantRepository;

    private final RestaurantService restaurantService;

    private final AuthorityRepository authorityRepository;

    private final RoleRepository roleRepository;

    public StaffService(
        StaffRepository staffRepository,
        RestaurantRepository restaurantRepository,
        RestaurantService restaurantService,
        AuthorityRepository authorityRepository,
        RoleRepository roleRepository
    ) {
        this.staffRepository = staffRepository;
        this.restaurantRepository = restaurantRepository;
        this.restaurantService = restaurantService;
        this.authorityRepository = authorityRepository;
        this.roleRepository = roleRepository;
    }

    public List<User> getAllStaff() {
        return staffRepository.findAll();
    }

    public Optional<User> getStaffById(UUID id) {
        return staffRepository.findById(id);
    }

    public Optional<User> getStaffByUsername(String username) {
        return staffRepository.findOneByUsername(username);
    }

    public User save(User user) {
        return staffRepository.save(user);
    }

    public void createStaff(StaffDTO staffDTO) {
        Optional<Restaurant> optionalRestaurant = restaurantRepository.findOneByName(staffDTO.getRestaurantName());
        User newUser = new User();
        newUser.setUsername(staffDTO.getUsername());
        newUser.setPassword(staffDTO.getPassword());
        newUser.setFullName(staffDTO.getFullName());
        newUser.setEmail(staffDTO.getEmail());
        newUser.setActivated(true);

        // doing error
        newUser.setRestaurant(optionalRestaurant.get());

        Set<Authority> authorities = new HashSet<>();
        authorityRepository.findById("ROLE_STAFF").ifPresent(authorities::add);

        Role role = new Role("Nhân viên", optionalRestaurant.get(), authorities);
        roleRepository.save(role);

        newUser.setRole(role);
        staffRepository.save(newUser);
        log.debug("Created information for Staff: {}", newUser);
    }
}
