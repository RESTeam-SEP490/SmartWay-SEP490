package com.resteam.smartway.repository;

import com.resteam.smartway.domain.MenuItem;
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
        "and (:search is null or lower(m.name) like concat('%',:search, '%' ))" +
        "and (:categoryId is null or m.menuItemCategory.id = :categoryId)" +
        "order by m.id"
    )
    Page<MenuItem> findWithFilterParams(
        @Param("restaurantId") String restaurantId,
        @Param("search") String search,
        @Param("categoryId") UUID menuItemCategoryId,
        Pageable pageable
    );
}
