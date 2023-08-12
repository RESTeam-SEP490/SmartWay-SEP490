package com.resteam.smartway.service.dto.order;

import java.util.List;
import java.util.UUID;
import lombok.Data;

@Data
public class ReturnItemDTO {

    private UUID id;
    private List<OrderDetailDTO> listItemsReturn;
}
