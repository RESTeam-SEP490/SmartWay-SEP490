package com.resteam.smartway.service.dto;

import com.resteam.smartway.domain.enumeration.CurrencyUnit;
import lombok.Data;

@Data
public class RestaurantDTO {

    private String id;

    private String name;

    private String phone;

    private CurrencyUnit currencyUnit;
}
