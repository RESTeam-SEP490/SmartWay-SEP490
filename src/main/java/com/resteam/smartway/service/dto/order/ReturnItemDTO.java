package com.resteam.smartway.service.dto.order;

import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class ReturnItemDTO {

    private UUID orderId;
    private List<OrderDetailDTO> listItemsReturn;
}
