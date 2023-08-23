package com.resteam.smartway.service.dto.statistic;

import java.time.Instant;
import lombok.Data;

@Data
public class StatisticsCancellationDTO {

    Instant date;
    int outOfStockQuantity;
    int exchangeItemQuantity;
    int longWaitingTimeQuantity;
    int customerUnsatisfiedQuantity;
    int othersQuantity;
}
