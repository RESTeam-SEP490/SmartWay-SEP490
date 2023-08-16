package com.resteam.smartway.service.dto.order;

import java.util.List;
import java.util.UUID;
import lombok.Data;

@Data
public class PrintBillDTO {

    private UUID orderId;
    private List<OrderDetailDTO> returnItemList;
    private Double discount;
}
