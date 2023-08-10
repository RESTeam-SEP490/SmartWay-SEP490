package com.resteam.smartway.repository.order;

import com.resteam.smartway.domain.order.notifications.ItemAdditionNotification;
import com.resteam.smartway.security.multitenancy.repository.BaseRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemAdditionNotificationRepository extends BaseRepository<ItemAdditionNotification> {
    List<ItemAdditionNotification> findByIsCompleted(boolean isCompleted);
    Optional<ItemAdditionNotification> findByIdAndIsCompleted(UUID id, boolean isCompleted);

    Optional<ItemAdditionNotification> findById(UUID uuid);
}
