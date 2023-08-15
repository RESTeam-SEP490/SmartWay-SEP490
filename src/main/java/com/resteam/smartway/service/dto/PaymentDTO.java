package com.resteam.smartway.service.dto;

import java.util.UUID;
import lombok.Data;

@Data
public class PaymentDTO {

    private UUID orderId;
    private Double discount;
    private Boolean isPayByCash;
    private UUID bankAccountId;
}
