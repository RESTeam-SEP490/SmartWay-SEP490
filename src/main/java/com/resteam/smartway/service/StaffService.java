package com.resteam.smartway.service;

import com.resteam.smartway.config.Constants;
import com.resteam.smartway.domain.Authority;
import com.resteam.smartway.domain.Role;
import com.resteam.smartway.domain.User;
import com.resteam.smartway.repository.*;
import com.resteam.smartway.service.dto.StaffDTO;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.security.RandomUtil;

@Service
@Transactional
public class StaffService {

    private final Logger log = LoggerFactory.getLogger(StaffService.class);

    private final StaffRepository staffRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthorityRepository authorityRepository;

    private final RestaurantRepository restaurantRepository;

    private final RoleRepository roleRepository;

    public StaffService(
        StaffRepository staffRepository,
        PasswordEncoder passwordEncoder,
        AuthorityRepository authorityRepository,
        RestaurantRepository restaurantRepository,
        RoleRepository roleRepository
    ) {
        this.staffRepository = staffRepository;
        this.passwordEncoder = passwordEncoder;
        this.authorityRepository = authorityRepository;
        this.restaurantRepository = restaurantRepository;
        this.roleRepository = roleRepository;
    }

    public List<User> listStaff() {
        return staffRepository.findAllBy();
    }

    public User createStaff(StaffDTO staffDTO) {
        User staff = new User();
        staff.setUsername(staffDTO.getUsername().toLowerCase());
        staff.setFullName(staffDTO.getFullName());
        staff.setEmail(staffDTO.getEmail().toLowerCase());
        staff.setLangKey(Constants.DEFAULT_LANGUAGE);
        String encryptPassword = passwordEncoder.encode(RandomUtil.generatePassword());
        staff.setPassword(encryptPassword);
        staff.setPhone(staffDTO.getPhone());
        staffRepository.save(staff);
        log.debug("Create Information for Staff: {}", staff);
        return staff;
    }
}
