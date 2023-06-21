package com.resteam.smartway.service.dto;

import com.resteam.smartway.domain.MenuItem;
import java.util.Set;
import java.util.UUID;
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

    @NotNull
    private String name;

    private MultipartFile imageSource;

    private String imageUrl;

    private Double basePrice;

    @NotNull
    private Double sellPrice;

    private Boolean isExtraItem = false;

    private UUID menuItemCategoryId;

    private Set<MenuItem> extraItemSet;
}
