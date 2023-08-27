package com.resteam.smartway.service.dto.order;

import java.util.UUID;
import lombok.Data;

@Data
public class RequireCheckOutDTO {

    private UUID orderId;
    private boolean isRequireCheckOut;
}
