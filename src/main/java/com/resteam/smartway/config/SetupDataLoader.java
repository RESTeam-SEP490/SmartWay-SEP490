package com.resteam.smartway.config;

import com.resteam.smartway.domain.Authority;
import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.domain.Role;
import com.resteam.smartway.domain.User;
import com.resteam.smartway.repository.RoleRepository;
import com.resteam.smartway.repository.UserRepository;
import com.resteam.smartway.security.AuthoritiesConstants;
import com.resteam.smartway.security.multitenancy.context.RestaurantContext;
import java.util.*;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Log4j2
public class SetupDataLoader implements ApplicationListener<ContextRefreshedEvent> {

    boolean alreadySetup = false;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void onApplicationEvent(ContextRefreshedEvent event) {
        if (alreadySetup) return;

        Role systemAdminRole = createRoleIfNotFound("SYSTEM_ADMIN", List.of(new Authority(AuthoritiesConstants.ROLE_SYSTEM_ADMIN)));
        createRoleIfNotFound("ADMIN", List.of(new Authority(AuthoritiesConstants.ROLE_ADMIN)));

        boolean isAdminAccountExisted = userRepository.existsByUsernameAndRestaurant("admin", new Restaurant(Constants.SYSTEM_RES_ID));
        if (!isAdminAccountExisted) {
            User user = User
                .builder()
                .fullName("System admin")
                .isSystemAdmin(true)
                .isActive(true)
                .username("admin")
                .email("admin@smartway.com")
                .password(passwordEncoder.encode("admin@2023"))
                .role(systemAdminRole)
                .build();
            userRepository.save(user);
        }

        alreadySetup = true;
    }

    @Transactional
    Role createRoleIfNotFound(String name, Collection<Authority> authorityCollection) {
        Role role = roleRepository.findByNameAndRestaurant(name, new Restaurant(Constants.SYSTEM_RES_ID));
        if (role == null) {
            role = new Role(name, authorityCollection);
            RestaurantContext.setCurrentRestaurant(new Restaurant(Constants.SYSTEM_RES_ID));
            roleRepository.save(role);
        }
        return role;
    }
}
