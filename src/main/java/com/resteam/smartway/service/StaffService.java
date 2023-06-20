package com.resteam.smartway.service;

import com.resteam.smartway.domain.Authority;
import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.domain.Role;
import com.resteam.smartway.domain.User;
import com.resteam.smartway.repository.AuthorityRepository;
import com.resteam.smartway.repository.RestaurantRepository;
import com.resteam.smartway.repository.RoleRepository;
import com.resteam.smartway.repository.StaffRepository;
import com.resteam.smartway.security.AuthoritiesConstants;
import com.resteam.smartway.service.dto.StaffDTO;
import com.resteam.smartway.web.rest.errors.SubdomainAlreadyUsedException;
import java.util.*;
import javax.swing.text.html.Option;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
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

    private final PasswordEncoder passwordEncoder;

    public StaffService(
        StaffRepository staffRepository,
        RestaurantRepository restaurantRepository,
        RestaurantService restaurantService,
        AuthorityRepository authorityRepository,
        RoleRepository roleRepository,
        PasswordEncoder passwordEncoder
    ) {
        this.staffRepository = staffRepository;
        this.restaurantRepository = restaurantRepository;
        this.restaurantService = restaurantService;
        this.authorityRepository = authorityRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllStaff() {
        return staffRepository.getAllStaff();
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
        Restaurant restaurant = new Restaurant(staffDTO.getRestaurantId());
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);

        Set<Authority> authorities = new HashSet<>();
        authorityRepository.findById(AuthoritiesConstants.STAFF).ifPresent(authorities::add);
        Role role = new Role("Staff", savedRestaurant, authorities);
        roleRepository.save(role);

        User newStaff = new User();
        String encryptedPassword = passwordEncoder.encode(staffDTO.getPassword());

        newStaff.setUsername(staffDTO.getUsername().toLowerCase());
        newStaff.setPassword(encryptedPassword);
        newStaff.setFullName(staffDTO.getFullName());
        newStaff.setEmail(staffDTO.getEmail().toLowerCase());
        newStaff.setPhone(staffDTO.getPhone());
        newStaff.setLangKey(staffDTO.getLangKey());
        newStaff.setRestaurant(savedRestaurant);
        newStaff.setRole(role);
        staffRepository.save(newStaff);

        log.debug("Created Information for staff: {}", newStaff);
    }

    public void deleteById(UUID id) {
        staffRepository.deleteById(id);
    }
    //    public Optional<StaffDTO> updateStaff(StaffDTO staffDTO) {
    //        Optional<User> optional = staffRepository.findOneByUsername(staffDTO.getUsername());
    //        if (optional.isEmpty()) {
    //            return Optional.empty();
    //        }
    //
    //        Optional<Restaurant> restaurant = restaurantRepository.findOneById(staffDTO.getRestaurantId());
    //        Restaurant currentRestaurant = new Restaurant(restaurant);
    //
    //        Set<Authority> authorities = new HashSet<>();
    //        authorityRepository.findById(AuthoritiesConstants.STAFF).ifPresent(authorities::add);
    //        Role role = new Role("Staff", currentRestaurant, authorities);
    //        roleRepository.save(role);
    //
    //        User entity = optional.get();
    //        String encryptedPassword = passwordEncoder.encode(staffDTO.getPassword());
    //
    //        entity.setUsername(staffDTO.getUsername().toLowerCase());
    //        entity.setPassword(encryptedPassword);
    //        entity.setFullName(staffDTO.getFullName());
    //        entity.setEmail(staffDTO.getEmail().toLowerCase());
    //        entity.setPhone(staffDTO.getPhone());
    //        entity.setLangKey(staffDTO.getLangKey());
    //        entity.setRestaurant(currentRestaurant);
    //        entity.setRole(role);
    //        return Optional.of(staffRepository.save(entity)).map(staf)
    //    }
}
