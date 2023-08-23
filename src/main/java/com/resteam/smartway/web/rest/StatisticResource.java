package com.resteam.smartway.web.rest;

import com.resteam.smartway.service.StatisticService;
import com.resteam.smartway.service.dto.statistic.StatisticDTO;
import com.resteam.smartway.service.dto.statistic.StatisticDateRangeDTO;
import com.resteam.smartway.service.dto.statistic.StatisticsCancellationDTO;
import com.resteam.smartway.service.dto.statistic.TopSellingItemsDTO;
import java.time.Duration;
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
    public ResponseEntity<StatisticDTO> getDailySalesStatistics() {
        StatisticDTO dailySalesStatistics = statisticService.calculateDailySalesStatistics();
        return ResponseEntity.ok(dailySalesStatistics);
    }

    @GetMapping("/revenue-by-time")
    public StatisticDateRangeDTO calculateStatistics(@RequestParam Instant startDay, @RequestParam Instant endDay) {
        long daysBetween = Duration.between(startDay, endDay).toDays();

        if (daysBetween > 31) {
            return statisticService.calculateMonthlyRevenueStatistics(startDay, endDay);
        } else {
            return statisticService.calculateSalesStatisticsByDateRange(startDay, endDay);
        }
    }

    @GetMapping("/cancel-items")
    public ResponseEntity<List<StatisticsCancellationDTO>> calculateCancelItems(
        @RequestParam Instant startDay,
        @RequestParam Instant endDay
    ) {
        List<StatisticsCancellationDTO> listCancelItem = statisticService.calculateCancellationOrder(startDay, endDay);
        return ResponseEntity.ok(listCancelItem);
    }

    @GetMapping("/best-sellers")
    public ResponseEntity<List<TopSellingItemsDTO>> getTopSellingItems(@RequestParam Instant startDay, @RequestParam Instant endDay) {
        List<TopSellingItemsDTO> topSellingItems = statisticService.calculateTopSellingItemsStatistics(startDay, endDay);
        return ResponseEntity.ok(topSellingItems);
    }
}
