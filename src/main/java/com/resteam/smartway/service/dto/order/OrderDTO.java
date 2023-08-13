package com.resteam.smartway.service.dto.order;

import com.resteam.smartway.service.dto.DiningTableDTO;
import com.resteam.smartway.service.dto.order.notification.KitchenNotificationHistoryDTO;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import javax.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class OrderDTO {

    private UUID id;
    private String code;
    private List<OrderDetailDTO> orderDetailList;
    private boolean isPaid;
    private Instant createdDate;
    private boolean isTakeAway;
    private boolean isCompleted;

    @NotEmpty
    private List<DiningTableDTO> tableList;

    private List<KitchenNotificationHistoryDTO> kitchenNotificationHistoryList;
}
