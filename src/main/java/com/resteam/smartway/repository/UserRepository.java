package com.resteam.smartway.repository;

import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.domain.Role;
import com.resteam.smartway.domain.User;
import com.resteam.smartway.security.multitenancy.annotation.DisableRestaurantFilter;
import com.resteam.smartway.security.multitenancy.repository.BaseRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends BaseRepository<User> {
    @DisableRestaurantFilter
    User findUserByRestaurantId(String id);

    Boolean existsByUsernameAndRestaurant(String username, Restaurant restaurant);

    Optional<User> findOneByResetKey(String resetKey);

    Optional<User> findOneByUsername(String username);

    Optional<User> findOneByEmailIgnoreCase(String username);

    Boolean existsByRole(Role role);

    @EntityGraph("user-with-authorities-entity-graph")
    Optional<User> findOneWithAuthoritiesByUsername(String username);

    @Query(
        "SELECT u FROM User u WHERE (:search IS NULL " +
        "OR LOWER(u.fullName) LIKE CONCAT('%', :search, '%')" +
        "OR LOWER(u.username) LIKE CONCAT('%', :search, '%')) " +
        "AND (coalesce(:roleIdList) IS NULL OR u.role.id IN :roleIdList)" +
        "AND u.role.restaurant.id NOT LIKE 'system@'"
    )
    Page<User> findWithFilterParams(@Param("search") String search, @Param("roleIdList") List<UUID> roleIdList, Pageable pageable);
}
