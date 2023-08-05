package com.resteam.smartway.repository.order;

import com.resteam.smartway.domain.order.SwOrder;
import com.resteam.smartway.security.multitenancy.repository.BaseRepository;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends BaseRepository<SwOrder> {
    @Override
    Optional<SwOrder> findById(UUID uuid);

    Optional<SwOrder> findTopByOrderByCodeDesc();
    List<SwOrder> findByIsPaidFalse();
    Optional<SwOrder> findByIdAndIsPaid(UUID id, boolean isPaid);

    @Query("SELECT o FROM SwOrder o WHERE o.isPaid = true AND o.payDate >= :startDay AND o.payDate <= :endDay order by o.payDate asc ")
    List<SwOrder> findAllByPaidTrueAndPayDateBetween(@Param("startDay") Instant startDay, @Param("endDay") Instant endDay);
}
