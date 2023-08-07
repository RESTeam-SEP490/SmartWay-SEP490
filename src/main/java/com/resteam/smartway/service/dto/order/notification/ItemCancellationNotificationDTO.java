package com.resteam.smartway.service.dto.order.notification;

import java.time.Instant;
import java.util.UUID;
import lombok.Data;

@Data
public class ItemCancellationNotificationDTO {

    private UUID id;
    private int quantity;
    private String createdBy;
    private Instant notifiedTime;
}
