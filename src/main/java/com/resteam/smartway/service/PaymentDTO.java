package com.resteam.smartway.service;

import java.util.UUID;
import lombok.Data;

@Data
public class PaymentDTO {

    private UUID orderId;
    private Double discount;
    private Boolean isPayByCash;
    private UUID bankAccountId;
    private boolean isClearTable;
}
