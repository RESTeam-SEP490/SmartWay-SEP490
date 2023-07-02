package com.resteam.smartway.service.dto;

import java.util.List;
import lombok.Data;

@Data
public class IsActiveUpdateDTO {

    private Boolean isActive;
    private List<String> ids;
}
