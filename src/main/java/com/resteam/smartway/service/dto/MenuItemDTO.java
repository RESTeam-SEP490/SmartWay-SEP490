package com.resteam.smartway.service.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.UUID;
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
    @Size(max = 50)
    private String name;

    @JsonIgnore
    private MultipartFile imageSource;

    private String imageUrl;

    private Double basePrice = 0.0;

    @NotNull
    private Double sellPrice;

    private Boolean isActive = true;

    private Boolean isInStock = true;

    @Size(max = 255)
    private String description;

    @NotNull
    private MenuItemCategoryDTO menuItemCategory;
}
