package com.resteam.smartway.repository;

import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.domain.User;
import com.resteam.smartway.security.multitenancy.repository.BaseRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface StaffRepository extends BaseRepository<User> {
    Boolean existsByUsernameAndRestaurant(String username, Restaurant restaurant);

    Optional<User> findOneByUsername(String username);

    @EntityGraph("user-with-authorities-entity-graph")
    Optional<User> findOneWithAuthoritiesByUsername(String username);

    List<User> findAllBy();
}
