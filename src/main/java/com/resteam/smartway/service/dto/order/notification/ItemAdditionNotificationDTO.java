package com.resteam.smartway.service.dto.order.notification;

import com.resteam.smartway.service.dto.DiningTableDTO;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.Data;

@Data
public class ItemAdditionNotificationDTO {

    private UUID id;
    private String createdBy;
    private Instant notifiedTime;
    private int quantity;
    private String menuItemName;
    private List<DiningTableDTO> tableList;
    private List<ItemCancellationNotificationDTO> itemCancellationNotificationList;
    private List<ReadyToServeNotificationInIANDTO> readyToServeNotificationList;
    private boolean isCompleted;
    private boolean isPriority;
    private String note;
}
