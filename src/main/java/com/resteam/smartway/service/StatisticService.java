package com.resteam.smartway.service;

import com.resteam.smartway.service.dto.statistic.MonthlyRevenueDTO;
import com.resteam.smartway.service.dto.statistic.StatisticDailyDayDTO;
import com.resteam.smartway.service.dto.statistic.StatisticDateRangeDTO;
import com.resteam.smartway.service.dto.statistic.TopSellingItemsDTO;
import java.time.Instant;
import java.util.List;

public interface StatisticService {
    StatisticDateRangeDTO calculateSalesStatisticsByDateRange(Instant startDay, Instant endDay);

    StatisticDailyDayDTO calculateDailySalesStatistics();

    MonthlyRevenueDTO calculateMonthlyRevenueStatistics();

    List<TopSellingItemsDTO> calculateTopSellingItemsStatistics(Instant startDay, Instant endDay);
}
