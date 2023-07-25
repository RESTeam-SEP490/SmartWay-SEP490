package com.resteam.smartway.service.dto.order;

import com.resteam.smartway.service.dto.DiningTableDTO;
import com.resteam.smartway.service.dto.order.OrderDetailDTO;
import java.time.Instant;
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
public class SwOrderDTO {

    private UUID id;
    private String code;
    private List<OrderDetailDTO> items;
    private boolean isPaid;

    private Instant createdDate;

    @NotNull
    private DiningTableDTO table;
}
