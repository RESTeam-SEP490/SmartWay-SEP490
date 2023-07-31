package com.resteam.smartway.service.dto.order.notification;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.Data;

@Data
public class KitchenNotificationHistoryDTO {

    private UUID id;
    private Instant notifiedTime;
    private String createdBy;
    private List<ItemAdditionNotificationDTO> itemAdditionNotificationList;
}
