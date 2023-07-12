package com.resteam.smartway.service.dto;

import java.util.UUID;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ZoneDTO {

    private UUID id;

    @NotBlank
    @Size(min = 1, max = 50)
    private String name;
}
