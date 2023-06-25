package com.resteam.smartway.repository;

import com.resteam.smartway.domain.MenuItem;
import com.resteam.smartway.domain.Restaurant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, UUID> {
    @Query(
        "SELECT m from MenuItem m where (:restaurantId is null or m.restaurant.id = :restaurantId)" +
        "and (:search is null " +
        "or lower(m.name) like concat('%',:search, '%' )" +
        "or lower(m.code) like concat('%',:search, '%' ))" +
        "and (coalesce(:categoryIdList) is null or m.menuItemCategory.id in :categoryIdList)"
    )
    Page<MenuItem> findWithFilterParams(
        @Param("restaurantId") String restaurantId,
        @Param("search") String search,
        @Param("categoryIdList") List<UUID> categoryIdList,
        Pageable pageable
    );

    Optional<MenuItem> findTopByRestaurantOrderByCodeDesc(Restaurant restaurant);
}
