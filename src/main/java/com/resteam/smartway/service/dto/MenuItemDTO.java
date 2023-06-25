package com.resteam.smartway.service.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.resteam.smartway.domain.MenuItem;
import java.util.Set;
import java.util.UUID;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
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
    private String name;

    @JsonIgnore
    private MultipartFile imageSource;

    private String imageUrl;

    private Double basePrice = 0.0;

    @NotNull
    private Double sellPrice;

    private Boolean isExtraItem = false;

    private Boolean isActive = true;

    private Boolean isAllowSale = true;

    private String description;

    @NotNull
    private MenuItemCategoryDTO menuItemCategory;

    private Set<MenuItemDTO> extraItemSet;
}
