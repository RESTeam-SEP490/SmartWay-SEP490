package com.resteam.smartway.service.dto.order;

import java.util.List;
import java.util.UUID;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderCreationDTO {

    @NotNull
    private UUID menuItemId;

    @NotNull
    private List<UUID> tableIdList;
}
