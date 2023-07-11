package com.resteam.smartway.service;

import com.resteam.smartway.config.Constants;
import com.resteam.smartway.domain.User;
import com.resteam.smartway.repository.*;
import com.resteam.smartway.service.dto.StaffDTO;
import com.resteam.smartway.service.mapper.StaffMapper;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.validation.Valid;
import lombok.SneakyThrows;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.security.RandomUtil;

@Service
@Transactional
public class StaffService {

    private static final String ENTITY_NAME = "staff";

    private final Logger log = LoggerFactory.getLogger(StaffService.class);

    private final StaffRepository staffRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthorityRepository authorityRepository;

    private final RestaurantRepository restaurantRepository;

    private final RoleRepository roleRepository;

    private final StaffMapper staffMapper;

    public StaffService(
        StaffRepository staffRepository,
        PasswordEncoder passwordEncoder,
        AuthorityRepository authorityRepository,
        RestaurantRepository restaurantRepository,
        RoleRepository roleRepository,
        StaffMapper staffMapper
    ) {
        this.staffRepository = staffRepository;
        this.passwordEncoder = passwordEncoder;
        this.authorityRepository = authorityRepository;
        this.restaurantRepository = restaurantRepository;
        this.roleRepository = roleRepository;
        this.staffMapper = staffMapper;
    }

    public Page<StaffDTO> loadStaffsWithSearch(Pageable pageable, String searchText, List<String> roleIds) {
        if (searchText != null) searchText = searchText.toLowerCase();
        List<UUID> roleUUIDList = null;
        if (roleIds != null && roleIds.size() > 0) roleUUIDList = roleIds.stream().map(UUID::fromString).collect(Collectors.toList());
        Page<User> userPage = staffRepository.findWithFilterParams(searchText, roleUUIDList, pageable);

        return userPage.map(staffMapper::toDto);
    }

    @SneakyThrows
    public StaffDTO createStaff(@Valid StaffDTO staffDTO) {
        User staff = staffMapper.toEntity(staffDTO);
        return staffMapper.toDto(staffRepository.save(staff));
    }

    public StaffDTO updateStaff(StaffDTO staffDTO) {
        User staff = staffRepository
            .findById(staffDTO.getId())
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ENTITY_NAME, " id not found"));

        staffMapper.partialUpdate(staff, staffDTO);
        User result = staffRepository.save(staff);
        return staffMapper.toDto(result);
    }

    public void deleteStaff(List<String> ids) {
        List<User> staffIdList = ids
            .stream()
            .map(id -> {
                if (id == null) throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "id null");
                return staffRepository
                    .findById(UUID.fromString(id))
                    .orElseThrow(() -> new BadRequestAlertException("Invalid id", ENTITY_NAME, "id null"));
            })
            .collect(Collectors.toList());
        staffRepository.deleteAll(staffIdList);
    }
}
