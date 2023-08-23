package com.resteam.smartway.security;

import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.domain.User;
import com.resteam.smartway.repository.UserRepository;
import com.resteam.smartway.security.multitenancy.context.RestaurantContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

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
        if (username == null) {
            throw new UsernameNotFoundException("Username and domain must be provided");
        }

        return userRepository
            .findOneWithAuthoritiesByUsername(username)
            .filter(User::getIsActive)
            .map(CustomUserDetails::build)
            .orElseThrow(() ->
                new UsernameNotFoundException(
                    String.format(
                        "Username not found for restaurant, username=%s, restaurant=%s",
                        username,
                        RestaurantContext.getCurrentRestaurant().getId()
                    )
                )
            );
    }
}
