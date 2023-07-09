package com.resteam.smartway.repository;

import com.resteam.smartway.domain.DiningTable;
import com.resteam.smartway.domain.MenuItemCategory;
import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.domain.Zone;
import com.resteam.smartway.security.multitenancy.repository.BaseRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ZoneRepository extends BaseRepository<Zone> {
    List<Zone> findAllByOrderByCreatedDateDesc();

    Optional<Zone> findOneByName(String name);
}
