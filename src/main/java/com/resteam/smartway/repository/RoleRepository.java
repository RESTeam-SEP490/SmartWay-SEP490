package com.resteam.smartway.repository;

import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.domain.Role;
import com.resteam.smartway.security.multitenancy.annotation.DisableRestaurantFilter;
import com.resteam.smartway.security.multitenancy.repository.BaseRepository;
import java.util.Optional;
import org.springframework.data.domain.Example;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends BaseRepository<Role> {
    @DisableRestaurantFilter
    Role findByNameAndRestaurant(String name, Restaurant restaurant);

    Optional<Role> findOneByName(String name);
}
