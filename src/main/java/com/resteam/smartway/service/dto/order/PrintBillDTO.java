package com.resteam.smartway.service.dto.order;

import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PrintBillDTO {

    private UUID orderId;
    private List<OrderDetailDTO> returnItemList;
    private Double discount;
}
