package com.resteam.smartway.service.dto.order.notification;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.Data;

@Data
public class ReadyToServeNotificationDTO {

    private UUID id;

    private int quantity;

    private ItemAdditionNotificationDTO itemAdditionNotification;

    private List<ItemCancellationNotificationDTO> itemCancellationNotificationList;

    private boolean isCompleted;
    private String createdBy;
    private Instant notifiedTime;
}
