package com.resteam.smartway.service.dto;

import com.resteam.smartway.domain.enumeration.CurrencyUnit;
import java.time.Instant;
import lombok.Data;

@Data
public class RestaurantDTO {

    private String id;

    private String name;

    private Instant planExpiry;

    private String fullName;

    private String email;

    private String phone;

    private CurrencyUnit currencyUnit;
}
