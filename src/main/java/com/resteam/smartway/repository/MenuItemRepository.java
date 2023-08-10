package com.resteam.smartway.repository;

import com.resteam.smartway.domain.MenuItem;
import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.security.multitenancy.repository.BaseRepository;
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
public interface MenuItemRepository extends BaseRepository<MenuItem> {
    @Query(
        "SELECT m from MenuItem m where (:search is null " +
        "or lower(m.name) like concat('%',:search, '%' )" +
        "or lower(m.code) like concat('%',:search, '%' ))" +
        "and (coalesce(:categoryIdList) is null or m.menuItemCategory.id in :categoryIdList)" +
        "and (:isActive is null or m.isActive is :isActive)"
    )
    Page<MenuItem> findWithFilterParams(
        @Param("search") String search,
        @Param("categoryIdList") List<UUID> categoryIdList,
        @Param("isActive") Boolean isActive,
        Pageable pageable
    );

    Optional<MenuItem> findTopByOrderByCodeDesc();

    Optional<MenuItem> findByIdAndIsActiveAndIsInStock(UUID id, boolean isActive, boolean isInStock);

    Optional<MenuItem> findOneByName(String name);
}
