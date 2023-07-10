package com.resteam.smartway.repository;

import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.domain.User;
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
public interface StaffRepository extends BaseRepository<User> {
    Boolean existsByUsernameAndRestaurant(String username, Restaurant restaurant);

    Optional<User> findOneByUsername(String username);

    @EntityGraph("user-with-authorities-entity-graph")
    Optional<User> findOneWithAuthoritiesByUsername(String username);

    List<User> findAllBy();

    @Query(
        "SELECT u FROM User u WHERE (:search IS NULL " +
        "OR LOWER(u.fullName) LIKE CONCAT('%', :search, '%')" +
        "OR LOWER(u.username) LIKE CONCAT('%', :search, '%')) " +
        "AND (:roleIdList IS NULL OR u.role.id IN :roleIdList)"
    )
    Page<User> findWithFilterParams(@Param("search") String search, @Param("roleIdList") List<UUID> roleIdList, Pageable pageable);
}
