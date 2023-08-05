package com.resteam.smartway.service.dto.statistic;

import com.resteam.smartway.domain.MenuItem;
import java.util.List;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TopSellingItemsDTO {

    MenuItem MenuItem;
    int quantity;
    double revenue;
}
