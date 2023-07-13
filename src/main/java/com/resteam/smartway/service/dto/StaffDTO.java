package com.resteam.smartway.service.dto;

import static com.resteam.smartway.service.dto.TenantRegistrationDTO.PASSWORD_MAX_LENGTH;
import static com.resteam.smartway.service.dto.TenantRegistrationDTO.PASSWORD_MIN_LENGTH;

import com.resteam.smartway.config.Constants;
import java.util.UUID;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StaffDTO {

    private UUID id;

    @NotBlank
    @Pattern(regexp = Constants.LOGIN_REGEX)
    @Size(min = 1, max = 50)
    private String username;

    @Size(min = PASSWORD_MIN_LENGTH, max = PASSWORD_MAX_LENGTH)
    private String password;

    @Size(max = 50)
    @Pattern(regexp = "^[p{L}\\D]+$")
    private String fullName;

    @Pattern(regexp = "^\\d+$")
    private String phone;

    @Email
    private String email;

    @Size(max = 50)
    private String restaurantId;

    @Size(min = 2, max = 10)
    private String langKey;

    private RoleDTO role;
}
