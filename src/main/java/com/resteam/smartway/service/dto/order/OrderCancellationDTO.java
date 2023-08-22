package com.resteam.smartway.service.dto.order;

import com.resteam.smartway.domain.enumeration.CancellationReason;
import java.util.UUID;
import lombok.Data;

@Data
public class OrderCancellationDTO {

    private UUID orderId;
    private CancellationReason cancellationReason;
    private String cancellationNote;
}
