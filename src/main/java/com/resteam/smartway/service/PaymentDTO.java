package com.resteam.smartway.service;

import com.resteam.smartway.service.dto.order.OrderDetailDTO;
import com.resteam.smartway.service.dto.order.ReturnItemDTO;
import java.util.List;
import java.util.UUID;
import lombok.Data;

@Data
public class PaymentDTO {

    private UUID orderId;
    private Double discount;
    private Boolean isPayByCash;
    private UUID bankAccountId;
    private boolean isFreeUpTable;
    private List<OrderDetailDTO> listReturnItems;
}
