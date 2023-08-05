package com.resteam.smartway.service.dto.statistic;

import java.time.Instant;
import java.util.List;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StatisticDateRangeDTO {

    //    private Instant startDay;
    //    private Instant endDay;
    private double totalRevenue;
    private int totalOrders;
    List<StatisticDailyDayDTO> statisticDailyDayDTOS;
}
