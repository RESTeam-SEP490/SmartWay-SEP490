package com.resteam.smartway.service.dto;

import java.util.UUID;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DiningTableDTO {

    private UUID id;

    @NotNull
    @Size(min = 1, max = 50)
    private String name;

    private Boolean isActive = true;

    private Boolean isFree = true;

    private int numberOfSeats;

    private ZoneDTO zone;
}
