package com.resteam.smartway.service.dto;

import java.time.Instant;
import java.util.UUID;
import javax.persistence.Column;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantDTO {

    private String id;

    private String name;

    private Instant planExpiry;

    private String fullName;

    private String email;

    private String phone;
}
