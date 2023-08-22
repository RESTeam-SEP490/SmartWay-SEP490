package com.resteam.smartway.service.dto;

import com.resteam.smartway.domain.enumeration.CurrencyUnit;
import java.time.Instant;
import javax.validation.constraints.Size;
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

    @Size(min = 2, max = 10)
    private String langKey;

    private Boolean isActive = true;
}
