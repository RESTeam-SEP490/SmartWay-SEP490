package com.resteam.smartway.service.dto.statistic;

import com.resteam.smartway.domain.order.SwOrder;
import com.resteam.smartway.service.dto.order.OrderDTO;
import java.time.Instant;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StatisticDailyDayDTO {

    //    private Instant startDay;
    private Instant date;
    private double totalRevenue;
    private int totalOrders;
}
