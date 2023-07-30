package com.resteam.smartway.service.dto.order;

import com.resteam.smartway.service.dto.MenuItemDTO;
import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailDTO {

    private UUID id;
    private UUID orderId;
    private MenuItemDTO menuItem;
    private int quantity;
    private boolean isCooked;
    private Instant notifiedTime;
    private String note;
}
