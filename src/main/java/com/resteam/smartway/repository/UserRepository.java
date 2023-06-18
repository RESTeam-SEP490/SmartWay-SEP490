package com.resteam.smartway.repository;

import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.domain.User;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the {@link User} entity.
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findOneByUsernameAndRestaurant(String username, Restaurant restaurant);
    Optional<User> findOneByResetKey(String resetKey);
    Optional<User> findOneByUsername(String username);

    Optional<User> findOneByEmailIgnoreCase(String username);

    @EntityGraph("user-with-authorities-entity-graph")
    Optional<User> findOneWithAuthoritiesByUsernameAndRestaurant(String username, Restaurant restaurant);

    @EntityGraph(attributePaths = "authorities")
    Optional<User> findOneWithAuthoritiesByEmailIgnoreCase(String email);
}
