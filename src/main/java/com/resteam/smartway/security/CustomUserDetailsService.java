package com.resteam.smartway.security;

import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.repository.UserRepository;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
public class CustomUserDetailsService implements UserDetailsService {

    private final Logger log = LoggerFactory.getLogger(CustomUserDetailsService.class);

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(final String username) {
        log.debug("Authenticating {}", username);
        String[] usernameAndRestaurantId = StringUtils.split(username.toLowerCase(Locale.ENGLISH), " ");
        if (usernameAndRestaurantId == null || usernameAndRestaurantId.length != 2) {
            throw new UsernameNotFoundException("Username and domain must be provided");
        }

        return userRepository
            .findOneWithAuthoritiesByUsernameAndRestaurant(usernameAndRestaurantId[0], new Restaurant(usernameAndRestaurantId[1]))
            .map(CustomUserDetails::build)
            .orElseThrow(() ->
                new UsernameNotFoundException(
                    String.format(
                        "Username not found for domain, username=%s, domain=%s",
                        usernameAndRestaurantId[0],
                        usernameAndRestaurantId[1]
                    )
                )
            );
    }
}
