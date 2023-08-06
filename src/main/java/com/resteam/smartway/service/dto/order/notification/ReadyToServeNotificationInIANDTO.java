package com.resteam.smartway.service.dto.order.notification;

import java.util.UUID;
import lombok.Data;

@Data
public class ReadyToServeNotificationInIANDTO {

    private UUID id;
    private int quantity;
}
