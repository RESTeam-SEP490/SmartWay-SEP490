package com.resteam.smartway.service;

import com.resteam.smartway.config.Constants;
import com.resteam.smartway.domain.Authority;
import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.domain.Role;
import com.resteam.smartway.domain.User;
import com.resteam.smartway.repository.AuthorityRepository;
import com.resteam.smartway.repository.RestaurantRepository;
import com.resteam.smartway.repository.RoleRepository;
import com.resteam.smartway.repository.UserRepository;
import com.resteam.smartway.security.AuthoritiesConstants;
import com.resteam.smartway.security.SecurityUtils;
import com.resteam.smartway.service.dto.AdminUserDTO;
import com.resteam.smartway.service.dto.TenantRegistrationDTO;
import com.resteam.smartway.web.rest.errors.SubdomainAlreadyUsedException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import tech.jhipster.security.RandomUtil;

/**
 * Service class for managing users.
 */
@Service
@Transactional
public class UserService {

    private final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthorityRepository authorityRepository;

    private final RestaurantRepository restaurantRepository;

    private final RoleRepository roleRepository;

    public UserService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        AuthorityRepository authorityRepository,
        RestaurantRepository restaurantRepository,
        RoleRepository roleRepository
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authorityRepository = authorityRepository;
        this.restaurantRepository = restaurantRepository;
        this.roleRepository = roleRepository;
    }

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

    public Optional<User> requestPasswordReset(String mail) {
        return userRepository
            .findOneByEmailIgnoreCase(mail)
            .map(user -> {
                user.setResetKey(RandomUtil.generateResetKey());
                user.setResetDate(Instant.now());
                return user;
            });
    }

    public void registerUser(TenantRegistrationDTO tenantRegistrationDTO) {
        restaurantRepository
            .findOneById(tenantRegistrationDTO.getRestaurantId())
            .ifPresent(r -> {
                throw new SubdomainAlreadyUsedException();
            });

        Restaurant restaurant = new Restaurant(tenantRegistrationDTO.getRestaurantId());
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);

        Set<Authority> authorities = new HashSet<>();
        authorityRepository.findById(AuthoritiesConstants.USER).ifPresent(authorities::add);
        Role role = new Role(null, "Nhân viên", authorities);
        role.setRestaurant(savedRestaurant);
        roleRepository.save(role);

        User newUser = new User();
        String encryptedPassword = passwordEncoder.encode(tenantRegistrationDTO.getPassword());
        newUser.setUsername(tenantRegistrationDTO.getUsername().toLowerCase());
        newUser.setPassword(encryptedPassword);
        newUser.setFullName(tenantRegistrationDTO.getFullName());
        newUser.setEmail(tenantRegistrationDTO.getEmail().toLowerCase());
        newUser.setPhone(tenantRegistrationDTO.getPhone());
        newUser.setLangKey(tenantRegistrationDTO.getLangKey());
        newUser.setRestaurant(savedRestaurant);
        newUser.setRole(role);
        userRepository.save(newUser);

        log.debug("Created Information for User: {}", newUser);
    }

    private boolean removeNonActivatedUser(User existingUser) {
        userRepository.delete(existingUser);
        userRepository.flush();
        return true;
    }

    public User createUser(AdminUserDTO userDTO) {
        User user = new User();
        user.setUsername(userDTO.getUsername().toLowerCase());
        user.setFullName(userDTO.getFullName());
        if (userDTO.getEmail() != null) {
            user.setEmail(userDTO.getEmail().toLowerCase());
        }
        if (userDTO.getLangKey() == null) {
            user.setLangKey(Constants.DEFAULT_LANGUAGE); // default language
        } else {
            user.setLangKey(userDTO.getLangKey());
        }
        String encryptedPassword = passwordEncoder.encode(RandomUtil.generatePassword());
        user.setPassword(encryptedPassword);
        user.setResetKey(RandomUtil.generateResetKey());
        user.setResetDate(Instant.now());
        if (userDTO.getAuthorities() != null) {
            Set<Authority> authorities = userDTO
                .getAuthorities()
                .stream()
                .map(authorityRepository::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toSet());
            user.setRole(new Role(null, "", authorities));
        }
        userRepository.save(user);
        log.debug("Created Information for User: {}", user);
        return user;
    }

    /**
     * Update all information for a specific user, and return the modified user.
     *
     * @param userDTO user to update.
     * @return updated user.
     */
    public Optional<AdminUserDTO> updateUser(AdminUserDTO userDTO) {
        return Optional
            .of(userRepository.findById(userDTO.getId()))
            .filter(Optional::isPresent)
            .map(Optional::get)
            .map(user -> {
                user.setUsername(userDTO.getUsername().toLowerCase());
                user.setFullName(userDTO.getFullName());
                if (userDTO.getEmail() != null) {
                    user.setEmail(userDTO.getEmail().toLowerCase());
                }
                user.setLangKey(userDTO.getLangKey());
                Collection<Authority> managedAuthorities = user.getRole().getAuthorities();
                managedAuthorities.clear();
                userDTO
                    .getAuthorities()
                    .stream()
                    .map(authorityRepository::findById)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .forEach(managedAuthorities::add);
                log.debug("Changed Information for User: {}", user);
                return user;
            })
            .map(AdminUserDTO::new);
    }

    public void deleteUser(String login) {
        userRepository
            .findOneByUsername(login)
            .ifPresent(user -> {
                userRepository.delete(user);
                log.debug("Deleted User: {}", user);
            });
    }

    /**
     * Update basic information (first name, last name, email, language) for the current user.
     *
     * @param firstName first name of user.
     * @param email     email id of user.
     * @param langKey   language key.
     */
    public void updateUser(String firstName, String email, String langKey) {
        SecurityUtils
            .getCurrentUserLogin()
            .flatMap(userRepository::findOneByUsername)
            .ifPresent(user -> {
                user.setFullName(firstName);
                if (email != null) {
                    user.setEmail(email.toLowerCase());
                }
                user.setLangKey(langKey);
                log.debug("Changed Information for User: {}", user);
            });
    }

    @Transactional
    public void changePassword(String currentClearTextPassword, String newPassword) {
        SecurityUtils
            .getCurrentUserLogin()
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

    //    @Transactional(readOnly = true)
    //    public Page<UserDTO> getAllPublicUsers(Pageable pageable) {
    //        return userRepository.findAllByIdNotNullAndActivatedIsTrue(pageable).map(UserDTO::new);
    //    }

    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthorities() {
        String[] usernameAndRestaurantId = StringUtils.split(SecurityUtils.getCurrentUserLogin().get(), " ");
        if (usernameAndRestaurantId == null || usernameAndRestaurantId.length != 2) {
            throw new UsernameNotFoundException("Username and domain must be provided");
        }
        return userRepository.findOneWithAuthoritiesByUsernameAndRestaurant(
            usernameAndRestaurantId[0],
            new Restaurant(usernameAndRestaurantId[1])
        );
    }

    /**
     * Gets a list of all the authorities.
     *
     * @return a list of all the authorities.
     */
    @Transactional(readOnly = true)
    public List<String> getAuthorities() {
        return authorityRepository.findAll().stream().map(Authority::getName).collect(Collectors.toList());
    }
}
