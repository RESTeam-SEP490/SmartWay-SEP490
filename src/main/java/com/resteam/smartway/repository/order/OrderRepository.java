package com.resteam.smartway.repository.order;

import com.resteam.smartway.domain.DiningTable;
import com.resteam.smartway.domain.order.SwOrder;
import com.resteam.smartway.security.multitenancy.repository.BaseRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends BaseRepository<SwOrder> {
    @Override
    Optional<SwOrder> findById(UUID uuid);

    Optional<SwOrder> findTopByOrderByCodeDesc();
    List<SwOrder> findByIsPaidFalse();
    Optional<SwOrder> findByIdAndIsPaid(UUID id, boolean isPaid);

    List<SwOrder> findDistinctByTableListInAndIsPaid(List<DiningTable> tables, boolean b);
}
