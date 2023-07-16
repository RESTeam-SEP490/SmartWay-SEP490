package com.resteam.smartway.service.dto;

import com.resteam.smartway.domain.DiningTable;
import java.util.List;
import java.util.UUID;
import javax.validation.constraints.NotBlank;
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

    @NotNull
    private DiningTableDTO table;
}
