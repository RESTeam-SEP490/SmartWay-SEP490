package com.resteam.smartway.service.mapper.order;

import com.resteam.smartway.domain.order.notifications.ItemAdditionNotification;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public class HasReadyToServeItemMapper {

    public int map(List<ItemAdditionNotification> itemAdditionNotificationList) {
        AtomicInteger readyToServeQuantity = new AtomicInteger();
        itemAdditionNotificationList.forEach(addition ->
            addition
                .getReadyToServeNotificationList()
                .forEach(rts -> {
                    if (!rts.isCompleted()) readyToServeQuantity.addAndGet(rts.getQuantity() - rts.getServedQuantity());
                    rts.getItemCancellationNotificationList().forEach(icn -> readyToServeQuantity.addAndGet(-icn.getQuantity()));
                })
        );
        return readyToServeQuantity.get();
    }
}
