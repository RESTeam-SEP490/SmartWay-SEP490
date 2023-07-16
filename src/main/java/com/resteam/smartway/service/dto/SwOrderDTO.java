package com.resteam.smartway.service.dto;

import com.resteam.smartway.domain.DiningTable;
import java.util.List;
import java.util.UUID;
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
    private DiningTable tableName;
}
