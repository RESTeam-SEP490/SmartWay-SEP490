package com.resteam.smartway.repository;

import com.resteam.smartway.domain.OrderDetail;
import com.resteam.smartway.domain.SwOrder;
import com.resteam.smartway.security.multitenancy.repository.BaseRepository;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SwOrderRepository extends BaseRepository<SwOrder> {
    Optional<SwOrder> findTopByOrderByCodeDesc();

    @Query("SELECT o FROM SwOrder o WHERE o.table.id = :tableId")
    Optional<SwOrder> findByTableId(@Param("tableId") UUID tableId);
}
