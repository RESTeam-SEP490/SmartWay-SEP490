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

    private String address;

    private Boolean isNew;

    private CurrencyUnit currencyUnit;

    private String stripeCustomerId;

    private String stripeSubscriptionId;

    @Size(min = 2, max = 10)
    private String langKey;
}
