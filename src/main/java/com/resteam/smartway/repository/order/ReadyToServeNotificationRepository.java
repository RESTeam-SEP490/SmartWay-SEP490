package com.resteam.smartway.repository.order;

import com.resteam.smartway.domain.order.notifications.ItemAdditionNotification;
import com.resteam.smartway.domain.order.notifications.ReadyToServeNotification;
import com.resteam.smartway.security.multitenancy.repository.BaseRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReadyToServeNotificationRepository extends BaseRepository<ReadyToServeNotification> {
    List<ReadyToServeNotification> findByIsCompleted(boolean isCompleted);

    Optional<ReadyToServeNotification> findByItemAdditionNotificationAndIsCompleted(
        ItemAdditionNotification itemAdditionNotification,
        boolean isCompleted
    );

    @Query("SELECT rts FROM ReadyToServeNotification rts WHERE rts.itemAdditionNotification.kitchenNotificationHistory.order.id = :orderId")
    List<ReadyToServeNotification> findByOrderId(@Param("orderId") UUID orderId);

    @Query(
        "SELECT rts FROM ReadyToServeNotification rts WHERE rts.itemAdditionNotification.orderDetail.id = :orderDetailId AND rts.isCompleted = :isCompleted"
    )
    List<ReadyToServeNotification> findByOrderDetailIdAndIsCompleted(
        @Param("orderDetailId") UUID id,
        @Param("isCompleted") boolean isCompleted
    );
}
