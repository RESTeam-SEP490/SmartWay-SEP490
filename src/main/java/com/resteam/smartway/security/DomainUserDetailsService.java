package com.resteam.smartway.security;

import com.resteam.smartway.domain.Authority;
import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.domain.User;
import com.resteam.smartway.repository.UserRepository;
import java.util.*;
import java.util.stream.Collectors;
import org.hibernate.validator.internal.constraintvalidators.hv.EmailValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

/**
 * Authenticate a user from the database.
 */
@Component("userDetailsService")
public class DomainUserDetailsService implements UserDetailsService {

    private final Logger log = LoggerFactory.getLogger(DomainUserDetailsService.class);

    private final UserRepository userRepository;

    public DomainUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(final String username) {
        log.debug("Authenticating {}", username);
        String[] usernameAndRestaurantName = StringUtils.split(username.toLowerCase(Locale.ENGLISH), " ");
        if (usernameAndRestaurantName == null || usernameAndRestaurantName.length != 2) {
            throw new UsernameNotFoundException("Username and domain must be provided");
        }

        return userRepository
            .findOneByUsernameAndRestaurant(usernameAndRestaurantName[0], new Restaurant(usernameAndRestaurantName[1]))
            .map(CustomUserDetails::build)
            .orElseThrow(() ->
                new UsernameNotFoundException(
                    String.format(
                        "Username not found for domain, username=%s, domain=%s",
                        usernameAndRestaurantName[0],
                        usernameAndRestaurantName[1]
                    )
                )
            );
    }
}
