package com.resteam.smartway.service.dto.statistic;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyRevenueDTO {

    private int month;
    private int year;
    private double totalRevenue;
}
