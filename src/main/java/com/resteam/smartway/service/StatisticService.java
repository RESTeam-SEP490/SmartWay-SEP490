package com.resteam.smartway.service;

import com.resteam.smartway.service.dto.statistic.StatisticDTO;
import com.resteam.smartway.service.dto.statistic.StatisticDateRangeDTO;
import com.resteam.smartway.service.dto.statistic.StatisticsCancellationDTO;
import com.resteam.smartway.service.dto.statistic.TopSellingItemsDTO;
import java.time.Instant;
import java.util.List;

public interface StatisticService {
    List<StatisticsCancellationDTO> calculateCancellationOrder(Instant startDay, Instant endDay);
    StatisticDateRangeDTO calculateSalesStatisticsByDateRange(Instant startDay, Instant endDay);

    StatisticDTO calculateDailySalesStatistics();

    StatisticDTO calculateDailySalesBill();

    StatisticDateRangeDTO calculateMonthlyRevenueStatistics(Instant startDay, Instant endDay);

    List<TopSellingItemsDTO> calculateTopSellingItemsStatistics(Instant startDay, Instant endDay);
}
