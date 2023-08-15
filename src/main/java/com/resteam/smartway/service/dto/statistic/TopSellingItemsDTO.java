package com.resteam.smartway.service.dto.statistic;

import com.resteam.smartway.domain.MenuItem;
import java.util.List;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TopSellingItemsDTO {

    MenuItem menuItem;
    int quantity;
    double revenue;
}
