package com.resteam.smartway.repository;

import com.resteam.smartway.domain.Zone;
import com.resteam.smartway.security.multitenancy.repository.BaseRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public interface ZoneRepository extends BaseRepository<Zone> {
    List<Zone> findAllByOrderByCreatedDateDesc();

    Optional<Zone> findOneByName(String name);
}
