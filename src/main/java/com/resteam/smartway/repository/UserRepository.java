package com.resteam.smartway.repository;

import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.domain.User;
import com.resteam.smartway.security.multitenancy.repository.BaseRepository;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends BaseRepository<User> {
    Boolean existsByUsernameAndRestaurant(String username, Restaurant restaurant);

    Optional<User> findOneByResetKey(String resetKey);

    Optional<User> findOneByUsername(String username);

    Optional<User> findOneByEmailIgnoreCase(String username);

    @EntityGraph("user-with-authorities-entity-graph")
    Optional<User> findOneWithAuthoritiesByUsername(String username);
}
