package com.resteam.smartway.service.dto;

import java.util.UUID;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import lombok.Data;

@Data
public class ZoneDTO {

    private static final long serialVersionUID = 1L;

    private UUID id;

    @NotBlank
    @Size(min = 1, max = 50)
    private String name;

    private UUID restaurant_id;
}
