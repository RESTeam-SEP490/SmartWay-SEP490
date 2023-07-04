package com.resteam.smartway.repository;

import com.resteam.smartway.domain.Restaurant;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@SuppressWarnings("unused")
@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, String> {
    Optional<Restaurant> findOneById(String name);

    Page<Restaurant> findAllByIdNotContains(String idNotContains, Pageable pageable);
}
