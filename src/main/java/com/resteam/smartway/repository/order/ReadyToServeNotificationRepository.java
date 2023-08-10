package com.resteam.smartway.repository.order;

import com.resteam.smartway.domain.order.notifications.ItemAdditionNotification;
import com.resteam.smartway.domain.order.notifications.ReadyToServeNotification;
import com.resteam.smartway.security.multitenancy.repository.BaseRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Repository;

@Repository
public interface ReadyToServeNotificationRepository extends BaseRepository<ReadyToServeNotification> {
    List<ReadyToServeNotification> findByIsCompleted(boolean isCompleted);

    Optional<ReadyToServeNotification> findByItemAdditionNotificationAndIsCompleted(
        ItemAdditionNotification itemAdditionNotification,
        boolean isCompleted
    );
    Optional<ReadyToServeNotification> findByIdAndIsCompleted(UUID id, boolean isCompleted);
}
