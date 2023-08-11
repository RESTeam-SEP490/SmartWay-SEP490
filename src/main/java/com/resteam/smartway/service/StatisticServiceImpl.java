package com.resteam.smartway.service;

import com.resteam.smartway.domain.MenuItem;
import com.resteam.smartway.domain.order.OrderDetail;
import com.resteam.smartway.domain.order.SwOrder;
import com.resteam.smartway.repository.order.OrderRepository;
import com.resteam.smartway.service.dto.statistic.StatisticDTO;
import com.resteam.smartway.service.dto.statistic.StatisticDateRangeDTO;
import com.resteam.smartway.service.dto.statistic.TopSellingItemsDTO;
import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class StatisticServiceImpl implements StatisticService {

    private final OrderRepository orderRepository;

    @Override
    public StatisticDateRangeDTO calculateMonthlyRevenueStatistics(Instant startDay, Instant endDay) {
        List<SwOrder> paidOrders = orderRepository.findAllByPaidTrueAndPayDateBetween(
            startDay.truncatedTo(ChronoUnit.DAYS),
            endDay.truncatedTo(ChronoUnit.DAYS).plus(1, ChronoUnit.DAYS).minus(1, ChronoUnit.SECONDS)
        );

        double totalRevenueForRange = 0;
        int totalOrders = 0;
        List<StatisticDTO> statisticsList = new ArrayList<>();

        YearMonth startMonth = YearMonth.from(startDay.atZone(ZoneId.systemDefault()));
        YearMonth endMonth = YearMonth.from(endDay.atZone(ZoneId.systemDefault()));

        for (YearMonth month = startMonth; !month.isAfter(endMonth); month = month.plusMonths(1)) {
            Instant currentMonthStart = month.atDay(1).atStartOfDay(ZoneId.of("UTC")).toInstant();
            Instant currentMonthEnd = month.atEndOfMonth().atStartOfDay(ZoneId.systemDefault()).toInstant().minus(1, ChronoUnit.SECONDS);

            List<SwOrder> ordersInCurrentMonth = paidOrders
                .stream()
                .filter(order -> order.getPayDate().isAfter(currentMonthStart) && order.getPayDate().isBefore(currentMonthEnd))
                .collect(Collectors.toList());

            double totalRevenueForMonth = 0;
            int ordersInMonth = ordersInCurrentMonth.size();

            for (SwOrder order : ordersInCurrentMonth) {
                totalRevenueForMonth += calculateOrderRevenue(order);
            }

            StatisticDTO currentMonthStatistic = new StatisticDTO(currentMonthStart, totalRevenueForMonth, ordersInMonth);
            statisticsList.add(currentMonthStatistic);
            totalRevenueForRange += totalRevenueForMonth;
            totalOrders += ordersInMonth;
        }

        return new StatisticDateRangeDTO(totalRevenueForRange, totalOrders, statisticsList);
    }

    @Override
    public StatisticDateRangeDTO calculateSalesStatisticsByDateRange(Instant startDay, Instant endDay) {
        List<SwOrder> paidOrders = orderRepository.findAllByPaidTrueAndPayDateBetween(
            startDay.truncatedTo(ChronoUnit.DAYS),
            endDay.truncatedTo(ChronoUnit.DAYS).plus(1, ChronoUnit.DAYS).minus(1, ChronoUnit.SECONDS)
        );
        double totalRevenueForRange = 0;
        double totalRevenueForDay = 0;
        int totalOrders = paidOrders.size();
        List<StatisticDTO> statisticsList = new ArrayList<>();

        LocalDate startDate = startDay.atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate endDate = endDay.atZone(ZoneId.systemDefault()).toLocalDate();

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            Instant currentDayStart = date.atStartOfDay(ZoneId.systemDefault()).toInstant();
            Instant currentDayEnd = date.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant().minus(1, ChronoUnit.SECONDS);

            List<SwOrder> ordersInCurrentDay = paidOrders
                .stream()
                .filter(order -> order.getCreatedDate().isAfter(currentDayStart) && order.getCreatedDate().isBefore(currentDayEnd))
                .collect(Collectors.toList());
            for (SwOrder order : ordersInCurrentDay) {
                totalRevenueForDay += calculateOrderRevenue(order);
            }
            StatisticDTO currentDay = new StatisticDTO(currentDayStart, totalRevenueForDay, ordersInCurrentDay.size());
            statisticsList.add(currentDay);
            totalRevenueForRange += totalRevenueForDay;
            totalRevenueForDay = 0;
        }
        return new StatisticDateRangeDTO(totalRevenueForRange, totalOrders, statisticsList);
    }

    @Override
    public StatisticDTO calculateDailySalesStatistics() {
        Instant currentDate = Instant.now();
        orderRepository.findAll();
        System.out.println(orderRepository.findAll());
        List<SwOrder> paidOrders = orderRepository.findAllByPaidTrueAndPayDateBetween(
            currentDate.truncatedTo(ChronoUnit.DAYS),
            currentDate.truncatedTo(ChronoUnit.DAYS).plus(1, ChronoUnit.DAYS)
        );

        if (paidOrders == null) {
            paidOrders = Collections.emptyList(); // Set it to an empty list
        }

        double totalRevenue = 0;
        int totalOrders = paidOrders.size();

        for (SwOrder order : paidOrders) {
            totalRevenue += calculateOrderRevenue(order);
        }

        return new StatisticDTO(currentDate, totalRevenue, totalOrders);
    }

    private double calculateOrderRevenue(SwOrder order) {
        double revenue = 0;
        for (OrderDetail orderDetail : order.getOrderDetailList()) {
            revenue += orderDetail.getQuantity() * orderDetail.getMenuItem().getSellPrice();
        }
        return revenue;
    }

    @Override
    public List<TopSellingItemsDTO> calculateTopSellingItemsStatistics(Instant startDay, Instant endDay) {
        List<SwOrder> paidOrders = orderRepository.findAllByPaidTrueAndPayDateBetween(
            startDay.truncatedTo(ChronoUnit.DAYS),
            endDay.truncatedTo(ChronoUnit.DAYS).plus(1, ChronoUnit.DAYS).minus(1, ChronoUnit.SECONDS)
        );

        List<TopSellingItemsDTO> topSellingItemsList = new ArrayList<>();

        for (SwOrder order : paidOrders) {
            for (OrderDetail orderDetail : order.getOrderDetailList()) {
                MenuItem menuItem = orderDetail.getMenuItem();
                UUID itemId = menuItem.getId();
                double revenue = orderDetail.getQuantity() * menuItem.getSellPrice();
                int quantity = orderDetail.getQuantity();

                boolean itemExists = false;

                for (TopSellingItemsDTO topSellingItem : topSellingItemsList) {
                    if (topSellingItem.getMenuItem().getId().equals(itemId)) {
                        topSellingItem.setQuantity(topSellingItem.getQuantity() + quantity);
                        topSellingItem.setRevenue(topSellingItem.getRevenue() + revenue);
                        itemExists = true;
                        break;
                    }
                }
                if (!itemExists) {
                    TopSellingItemsDTO newTopSellingItem = new TopSellingItemsDTO(menuItem, quantity, revenue);
                    topSellingItemsList.add(newTopSellingItem);
                }
            }
        }
        Collections.sort(topSellingItemsList, (item1, item2) -> Double.compare(item2.getRevenue(), item1.getRevenue()));
        return topSellingItemsList;
    }
}
