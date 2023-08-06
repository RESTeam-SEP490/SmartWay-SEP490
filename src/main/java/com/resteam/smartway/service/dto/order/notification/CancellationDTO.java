package com.resteam.smartway.service.dto.order.notification;

import java.util.UUID;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CancellationDTO {

    @NotNull
    private boolean isCancelServedItemFirst;

    @NotNull
    private UUID orderDetailId;

    @Min(1)
    private int cancelledQuantity;
}
