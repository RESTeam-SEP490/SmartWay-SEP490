package com.resteam.smartway.repository.order;

import com.resteam.smartway.domain.order.notifications.ItemCancellationNotification;
import com.resteam.smartway.security.multitenancy.repository.BaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemCancellationNotificationRepository extends BaseRepository<ItemCancellationNotification> {}
