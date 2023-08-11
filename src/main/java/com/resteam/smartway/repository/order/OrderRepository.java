package com.resteam.smartway.repository.order;

import com.resteam.smartway.domain.DiningTable;
import com.resteam.smartway.domain.order.SwOrder;
import com.resteam.smartway.security.multitenancy.repository.BaseRepository;
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
    Optional<SwOrder> findByIdAndIsPaid(UUID id, boolean isPaid);
    List<SwOrder> findAllByIsCompleted(boolean isCompleted);

    @Query(
        value = "SELECT DISTINCT * FROM sw_order o " +
        "INNER JOIN order_table ot ON o.id = ot.order_id " +
        "WHERE ot.table_id IN :tableList AND o.is_paid = :isPaid",
        nativeQuery = true
    )
    List<SwOrder> findDistinctByTableListAndIsPaid(@Param("tableList") List<DiningTable> tableList, @Param("isPaid") boolean isPaid);

    @Query(
        value = "SELECT * FROM sw_order o " +
        "INNER JOIN order_table ot ON o.id = ot.order_id " +
        "WHERE ot.table_id = :table AND o.is_paid = :isPaid LIMIT 1",
        nativeQuery = true
    )
    Optional<SwOrder> findOneByTableAndIsPaid(@Param("table") DiningTable table, @Param("isPaid") boolean isPaid);
}
