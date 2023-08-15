package com.resteam.smartway.repository;

import com.resteam.smartway.domain.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AdminRepository extends JpaRepository<Restaurant, String> {
    @Query("SELECT m from Restaurant m where (:search is null " + "or lower(m.name) like concat('%',:search, '%' ))")
    Page<Restaurant> findWithFilterParams(@Param("search") String search, Pageable pageable);
}
