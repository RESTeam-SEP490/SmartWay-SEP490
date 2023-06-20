package com.resteam.smartway.service.dto;

import com.resteam.smartway.domain.User;
import java.util.UUID;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StaffDTO {

    public static final int PASSWORD_MIN_LENGTH = 4;

    public static final int PASSWORD_MAX_LENGTH = 100;

    @NotBlank
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

    @NotBlank
    @Size(max = 50)
    private String restaurantId;

    @Size(min = 2, max = 10)
    private String langKey;

    public StaffDTO(User user) {
        this.username = user.getUsername();
        this.password = user.getPassword();
        this.fullName = user.getFullName();
        this.phone = user.getPhone();
        this.email = user.getEmail();
        this.restaurantId = user.getRestaurant().getId();
        this.langKey = user.getLangKey();
    }
}
