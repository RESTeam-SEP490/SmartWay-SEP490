package com.resteam.smartway.repository;

import com.resteam.smartway.domain.MenuItemCategory;
import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.security.multitenancy.repository.BaseRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Repository;

@Repository
public interface MenuItemCategoryRepository extends BaseRepository<MenuItemCategory> {
    List<MenuItemCategory> findAllByOrderByCreatedDateDesc();

    Optional<MenuItemCategory> findByRestaurantAndId(Restaurant restaurant, UUID uuid);

    MenuItemCategory findByName(String name);
    Optional<MenuItemCategory> findOneByName(String name);
}
