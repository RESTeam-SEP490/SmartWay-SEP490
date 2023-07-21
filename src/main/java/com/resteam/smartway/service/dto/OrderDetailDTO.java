package com.resteam.smartway.service.dto;

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
    private String orderId;
    private MenuItemDTO menuItem;
    private int quantity;
    private boolean isCooked;
}
