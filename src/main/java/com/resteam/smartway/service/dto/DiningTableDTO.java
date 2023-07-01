package com.resteam.smartway.service.dto;

import com.resteam.smartway.domain.enumeration.TableStatus;
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

    private TableStatus status;

    @NotNull
    private ZoneDTO zone;
}
