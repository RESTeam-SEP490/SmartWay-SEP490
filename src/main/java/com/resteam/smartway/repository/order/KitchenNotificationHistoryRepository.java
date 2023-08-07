package com.resteam.smartway.repository.order;

import com.resteam.smartway.domain.order.notifications.ItemAdditionNotification;
import com.resteam.smartway.domain.order.notifications.KitchenNotificationHistory;
import com.resteam.smartway.security.multitenancy.repository.BaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KitchenNotificationHistoryRepository extends BaseRepository<KitchenNotificationHistory> {}
