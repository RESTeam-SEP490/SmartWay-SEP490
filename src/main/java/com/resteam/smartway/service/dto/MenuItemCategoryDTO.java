package com.resteam.smartway.service.dto;

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
public class MenuItemCategoryDTO {

    private UUID id;

    @NotNull
    private String name;

    private String description;
}
