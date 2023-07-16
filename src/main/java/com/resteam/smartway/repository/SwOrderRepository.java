package com.resteam.smartway.repository;

import com.resteam.smartway.domain.SwOrder;
import com.resteam.smartway.security.multitenancy.repository.BaseRepository;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public interface SwOrderRepository extends BaseRepository<SwOrder> {
    Optional<SwOrder> findTopByOrderByCodeDesc();
}
