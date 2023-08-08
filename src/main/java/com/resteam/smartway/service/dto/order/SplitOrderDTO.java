package com.resteam.smartway.service.dto.order;

import java.util.List;
import java.util.UUID;
import lombok.Data;

@Data
public class SplitOrderDTO {

    private UUID targetTableId;
    private List<UUID> orderDetailIds;
}
