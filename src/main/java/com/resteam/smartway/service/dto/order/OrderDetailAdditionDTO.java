package com.resteam.smartway.service.dto.order;

import com.resteam.smartway.service.dto.MenuItemDTO;
import java.util.UUID;
import lombok.Data;

@Data
public class OrderDetailAdditionDTO {

    private UUID orderId;
    private MenuItemDTO menuItem;
    private int quantity;
}
