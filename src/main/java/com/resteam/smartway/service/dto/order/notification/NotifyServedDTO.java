package com.resteam.smartway.service.dto.order.notification;

import java.util.UUID;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NotifyServedDTO {

    @NotNull
    private UUID readyToServeNotificationId;

    @Min(0)
    private int servedQuantity;
}
