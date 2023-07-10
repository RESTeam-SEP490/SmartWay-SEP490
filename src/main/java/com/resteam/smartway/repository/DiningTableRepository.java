package com.resteam.smartway.repository;

import com.resteam.smartway.domain.DiningTable;
import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.security.multitenancy.repository.BaseRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DiningTableRepository extends BaseRepository<DiningTable> {
    @Query(
        "SELECT m from DiningTable m where (:search is null " +
        "or lower(m.name) like concat('%',:search, '%' ))" +
        "and (coalesce(:zoneIdList) is null or m.zone.id in :zoneIdList)" +
        "and (:isActive is null or m.isActive is :isActive)"
    )
    Page<DiningTable> findWithFilterParams(
        @Param("search") String search,
        @Param("zoneIdList") List<UUID> zoneIdList,
        @Param("isActive") Boolean isActive,
        Pageable pageable
    );

    Optional<DiningTable> findByIdAndRestaurant(UUID uuid, Restaurant restaurant);
}
