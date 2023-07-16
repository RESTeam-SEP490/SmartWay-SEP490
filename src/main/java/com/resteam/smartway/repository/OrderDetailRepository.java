package com.resteam.smartway.repository;

import com.resteam.smartway.domain.OrderDetail;
import com.resteam.smartway.security.multitenancy.repository.BaseRepository;
import java.util.Optional;

public interface OrderDetailRepository extends BaseRepository<OrderDetail> {
    Optional<OrderDetail> findTopByOrderByCodeDesc();
}
