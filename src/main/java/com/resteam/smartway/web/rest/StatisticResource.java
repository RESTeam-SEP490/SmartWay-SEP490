package com.resteam.smartway.web.rest;

import com.resteam.smartway.service.StatisticService;
import com.resteam.smartway.service.dto.statistic.MonthlyRevenueDTO;
import com.resteam.smartway.service.dto.statistic.StatisticDailyDayDTO;
import com.resteam.smartway.service.dto.statistic.StatisticDateRangeDTO;
import com.resteam.smartway.service.dto.statistic.TopSellingItemsDTO;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Log4j2
@RestController
@RequestMapping("/api/statistics")
@Transactional
@RequiredArgsConstructor
public class StatisticResource {

    private final StatisticService statisticService;

    @GetMapping("/daily-sales")
    public ResponseEntity<StatisticDailyDayDTO> getDailySalesStatistics() {
        StatisticDailyDayDTO dailySalesStatistics = statisticService.calculateDailySalesStatistics();
        return ResponseEntity.ok(dailySalesStatistics);
    }

    @GetMapping("/sales")
    public ResponseEntity<StatisticDateRangeDTO> calculateSalesStatisticsByDateRange(
        @RequestParam Instant startDay,
        @RequestParam Instant endDay
    ) {
        StatisticDateRangeDTO statistics = statisticService.calculateSalesStatisticsByDateRange(startDay, endDay);
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/monthly-revenue")
    public ResponseEntity<MonthlyRevenueDTO> getMonthlyRevenueStatistics() {
        MonthlyRevenueDTO monthlyRevenueStatistics = statisticService.calculateMonthlyRevenueStatistics();
        return ResponseEntity.ok(monthlyRevenueStatistics);
    }

    @GetMapping("/best-sellers")
    public ResponseEntity<List<TopSellingItemsDTO>> getTopSellingItems(@RequestParam Instant startDay, @RequestParam Instant endDay) {
        List<TopSellingItemsDTO> topSellingItems = statisticService.calculateTopSellingItemsStatistics(startDay, endDay);
        return ResponseEntity.ok(topSellingItems);
    }
}
