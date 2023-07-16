package com.resteam.smartway.service;

import com.resteam.smartway.domain.Authority;
import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.domain.Role;
import com.resteam.smartway.domain.User;
import com.resteam.smartway.repository.AuthorityRepository;
import com.resteam.smartway.repository.RestaurantRepository;
import com.resteam.smartway.repository.RoleRepository;
import com.resteam.smartway.repository.UserRepository;
import com.resteam.smartway.security.SecurityUtils;
import com.resteam.smartway.security.multitenancy.context.RestaurantContext;
import com.resteam.smartway.service.dto.StaffDTO;
import com.resteam.smartway.service.dto.TenantRegistrationDTO;
import com.resteam.smartway.service.mapper.StaffMapper;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import com.resteam.smartway.web.rest.errors.SubdomainAlreadyUsedException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.security.RandomUtil;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthorityRepository authorityRepository;

    private final RestaurantRepository restaurantRepository;

    private final RoleRepository roleRepository;

    private final StaffMapper staffMapper;

    private final String ENTITY_NAME_STAFF = "staff";

    @Override
    public Optional<User> completePasswordReset(String newPassword, String key) {
        log.debug("Reset user password for reset key {}", key);
        return userRepository
            .findOneByResetKey(key)
            .filter(user -> user.getResetDate().isAfter(Instant.now().minus(1, ChronoUnit.DAYS)))
            .map(user -> {
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setResetKey(null);
                user.setResetDate(null);
                return user;
            });
    }

    @Override
    public Optional<User> requestPasswordReset(String mail) {
        return userRepository
            .findOneByEmailIgnoreCase(mail)
            .map(user -> {
                user.setResetKey(RandomUtil.generateResetKey());
                user.setResetDate(Instant.now());
                return user;
            });
    }

    @Override
    public String registerUser(TenantRegistrationDTO tenantRegistrationDTO) {
        restaurantRepository
            .findOneById(tenantRegistrationDTO.getRestaurantId())
            .ifPresent(r -> {
                throw new SubdomainAlreadyUsedException();
            });

        Restaurant restaurant = new Restaurant(tenantRegistrationDTO.getRestaurantId());
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        RestaurantContext.setCurrentRestaurant(savedRestaurant);

        Role role = roleRepository.findByNameAndRestaurant("ADMIN", new Restaurant("system@"));

        User newUser = new User();
        String encryptedPassword = passwordEncoder.encode(tenantRegistrationDTO.getPassword());
        newUser.setUsername(tenantRegistrationDTO.getUsername().toLowerCase());
        newUser.setPassword(encryptedPassword);
        newUser.setFullName(tenantRegistrationDTO.getFullName());
        newUser.setEmail(tenantRegistrationDTO.getEmail().toLowerCase());
        newUser.setPhone(tenantRegistrationDTO.getPhone());
        newUser.setLangKey(tenantRegistrationDTO.getLangKey());
        newUser.setRole(role);
        userRepository.save(newUser);

        log.debug("Created Information for User: {}", newUser);
        return savedRestaurant.getId();
    }

    @Transactional
    @Override
    public void changePassword(String currentClearTextPassword, String newPassword) {
        SecurityUtils
            .getCurrentUsername()
            .flatMap(userRepository::findOneByUsername)
            .ifPresent(user -> {
                String currentEncryptedPassword = user.getPassword();
                if (!passwordEncoder.matches(currentClearTextPassword, currentEncryptedPassword)) {
                    throw new InvalidPasswordException();
                }
                String encryptedPassword = passwordEncoder.encode(newPassword);
                user.setPassword(encryptedPassword);
                log.debug("Changed password for User: {}", user);
            });
    }

    @Transactional(readOnly = true)
    @Override
    public Optional<User> getUserWithAuthorities() {
        String username = SecurityUtils.getCurrentUsername().orElseThrow(() -> new UsernameNotFoundException(("Username must be provide")));

        return userRepository.findOneWithAuthoritiesByUsername(username);
    }

    @Transactional(readOnly = true)
    @Override
    public List<String> getAuthorities() {
        return authorityRepository.findAll().stream().map(Authority::getName).collect(Collectors.toList());
    }

    @Override
    public Page<StaffDTO> loadStaffsWithSearch(Pageable pageable, String searchText, List<String> roleIds) {
        if (searchText != null) searchText = searchText.toLowerCase();
        List<UUID> roleUUIDList = null;
        if (roleIds != null && roleIds.size() > 0) roleUUIDList = roleIds.stream().map(UUID::fromString).collect(Collectors.toList());
        Page<User> userPage = userRepository.findWithFilterParams(searchText, roleUUIDList, pageable);
        return userPage.map(staffMapper::toDto);
    }

    @SneakyThrows
    @Override
    public StaffDTO createStaff(StaffDTO staffDTO) {
        String encryptedPassword = passwordEncoder.encode(staffDTO.getPassword());
        staffDTO.setPassword(encryptedPassword);
        User staff = staffMapper.toEntity(staffDTO);
        return staffMapper.toDto(userRepository.save(staff));
    }

    @Override
    public StaffDTO updateStaff(StaffDTO staffDTO) {
        User staff = userRepository
            .findById(staffDTO.getId())
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ENTITY_NAME_STAFF, " id not found"));
        staffMapper.partialUpdate(staff, staffDTO);
        if (staffDTO.getPassword() != null) {
            String encryptedPassword = passwordEncoder.encode(staffDTO.getPassword());
            staff.setPassword(encryptedPassword);
        }
        User result = userRepository.save(staff);
        return staffMapper.toDto(result);
    }

    @Override
    public void deleteStaff(List<String> ids) {
        List<User> staffIdList = ids
            .stream()
            .map(id -> {
                if (id == null) throw new BadRequestAlertException("Invalid id", ENTITY_NAME_STAFF, "id null");
                return userRepository
                    .findById(UUID.fromString(id))
                    .orElseThrow(() -> new BadRequestAlertException("Invalid id", ENTITY_NAME_STAFF, "id null"));
            })
            .collect(Collectors.toList());
        userRepository.deleteAll(staffIdList);
    }

    @Override
    public void updateUser(String fullName, String email, String langKey) {
        SecurityUtils
            .getCurrentUsername()
            .flatMap(userRepository::findOneByUsername)
            .ifPresent(user -> {
                user.setFullName(fullName);
                if (email != null) {
                    user.setEmail(email.toLowerCase());
                }
                user.setLangKey(langKey);
                log.debug("Changed Information for User: {}", user);
            });
    }
}
