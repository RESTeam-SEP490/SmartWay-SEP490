package com.resteam.smartway.repository;

import com.resteam.smartway.domain.DiningTable;
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
public interface DiningTableRepository extends JpaRepository<DiningTable, UUID> {
    @Query(
        "SELECT m from DiningTable m where (:restaurantId is null or m.restaurant.id = :restaurantId)" +
        "and (:search is null " +
        "or lower(m.name) like concat('%',:search, '%' ))" +
        "and (coalesce(:zoneIdList) is null or m.zone.id in :zoneIdList)"
    )
    Page<DiningTable> findWithFilterParams(
        @Param("restaurantId") String restaurantId,
        @Param("search") String search,
        @Param("zoneIdList") List<UUID> zoneIdList,
        Pageable pageable
    );

    Optional<DiningTable> findByIdAndRestaurant(UUID uuid, Restaurant restaurant);
}
