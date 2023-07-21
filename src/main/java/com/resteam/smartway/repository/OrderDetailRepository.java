package com.resteam.smartway.repository;

import com.resteam.smartway.domain.MenuItem;
import com.resteam.smartway.domain.OrderDetail;
import com.resteam.smartway.domain.SwOrder;
import com.resteam.smartway.security.multitenancy.repository.BaseRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderDetailRepository extends BaseRepository<OrderDetail> {
    Optional<OrderDetail> findBySwOrderAndMenuItem(SwOrder order, MenuItem menuItem);
    List<OrderDetail> findByIsCookedFalseOrderByCreatedDate();
}
