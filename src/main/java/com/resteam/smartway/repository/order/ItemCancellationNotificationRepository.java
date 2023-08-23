package com.resteam.smartway.repository.order;

import com.resteam.smartway.domain.order.notifications.ItemCancellationNotification;
import com.resteam.smartway.security.multitenancy.repository.BaseRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemCancellationNotificationRepository extends BaseRepository<ItemCancellationNotification> {
    @Query(
        "select icn from ItemCancellationNotification icn where icn.kitchenNotificationHistory.notifiedTime between :startDay and :endDay"
    )
    List<ItemCancellationNotification> findByDateBetween(@Param("startDay") Instant startDay, @Param("endDay") Instant endDay);
}
