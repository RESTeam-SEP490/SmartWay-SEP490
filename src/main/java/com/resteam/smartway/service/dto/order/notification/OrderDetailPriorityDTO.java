package com.resteam.smartway.service.dto.order.notification;

import java.util.UUID;
import lombok.Data;

@Data
public class OrderDetailPriorityDTO {

    private UUID orderDetailId;

    private UUID orderId;
    private boolean isPriority;
}
