package com.resteam.smartway.service.dto.order;

import java.util.UUID;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderDetailAdjustQuantityDTO {

    @NotNull
    private UUID orderDetailId;

    private int quantityAdjust;
}
