package com.resteam.smartway.service.dto;

import com.resteam.smartway.domain.enumeration.TableStatus;
import java.io.Serializable;
import java.util.UUID;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import lombok.Data;

@Data
public class DiningTableDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private UUID id;

    @NotBlank
    @Size(min = 1, max = 50)
    private String name;

    private TableStatus status;

    private UUID zoneId;
    private UUID restaurantId;

    public UUID getZoneId() {
        return zoneId;
    }

    public void setZoneId(UUID zoneId) {
        this.zoneId = zoneId;
    }
}
