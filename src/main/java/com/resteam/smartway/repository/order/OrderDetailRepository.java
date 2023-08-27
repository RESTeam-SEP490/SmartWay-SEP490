package com.resteam.smartway.repository.order;

import com.resteam.smartway.domain.MenuItem;
import com.resteam.smartway.domain.order.OrderDetail;
import com.resteam.smartway.domain.order.SwOrder;
import com.resteam.smartway.security.multitenancy.repository.BaseRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderDetailRepository extends BaseRepository<OrderDetail> {
    Optional<OrderDetail> findByOrderAndMenuItem(SwOrder order, MenuItem menuItem);

    @Query("SELECT s FROM SwOrder s")
    List<OrderDetail> findByIsCookedFalseOrderByCreatedDate();

    List<OrderDetail> findAllByOrder_Id(UUID id);
}
