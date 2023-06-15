package com.resteam.smartway.service.dto;

import java.util.UUID;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StaffDTO {

    private String username;

    private String password;

    private String fullName;

    private String email;

    private String phone;

    private String restaurantName;
}
