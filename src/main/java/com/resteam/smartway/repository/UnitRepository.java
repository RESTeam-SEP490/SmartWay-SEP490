package com.resteam.smartway.repository;

import com.resteam.smartway.domain.Unit;
import com.resteam.smartway.security.multitenancy.repository.BaseRepository;
import java.util.List;
import java.util.Optional;

public interface UnitRepository extends BaseRepository<Unit> {
    List<Unit> findAllByOrderByCreatedDateDesc();

    Optional<Unit> findOneByName(String name);
}
