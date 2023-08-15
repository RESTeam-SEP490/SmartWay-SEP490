package com.resteam.smartway.service.dto.statistic;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StatisticDTO {

    //    private Instant startDay;
    private Instant date;
    private double totalRevenue;
    private int totalOrders;
}
