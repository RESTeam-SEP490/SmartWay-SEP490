package com.resteam.smartway.repository;

import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.domain.Zone;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ZoneRepository extends JpaRepository<Zone, UUID> {
    List<Zone> findAllByRestaurantOrderByCreatedDateDesc(Restaurant restaurant);
    Optional<Zone> findOneByRestaurantAndName(Restaurant restaurant, String name);

    Optional<Zone> findByRestaurantAndId(Restaurant restaurant, UUID uuid);

    Boolean existsByIdAndRestaurant(UUID id, Restaurant restaurant);
}
