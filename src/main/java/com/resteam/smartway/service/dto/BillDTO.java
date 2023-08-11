package com.resteam.smartway.service.dto;

import com.resteam.smartway.service.dto.order.OrderDetailDTO;
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
public class BillDTO {

    private String orderCode;
    private List<DiningTableDTO> tableList;
    private List<OrderDetailDTO> orderDetailList;
    private double sumMoney;
    private double discount;
    private Instant payDate;
}
