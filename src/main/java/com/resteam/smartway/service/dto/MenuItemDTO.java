package com.resteam.smartway.service.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.resteam.smartway.domain.Unit;
import java.util.UUID;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemDTO {

    private UUID id;

    private String code;

    @NotBlank
    @Size(max = 100)
    private String name;

    @JsonIgnore
    private MultipartFile imageSource;

    private String imageUrl;

    @Min(0)
    private Double basePrice = 0.0;

    @NotNull
    @Min(0)
    private Double sellPrice;

    private Boolean isActive = true;

    private Boolean isInStock = true;

    @Size(max = 255)
    private String description;

    @NotNull
    private MenuItemCategoryDTO menuItemCategory;

    @NotNull
    private Unit unit;
}
