package com.resteam.smartway.web.websocket.dto;

import java.util.UUID;
import lombok.Data;

@Data
public class OrderEventDTO {

    private OrderEvenType type;
    private UUID orderId;
    private String rawData;
}
