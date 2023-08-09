package com.resteam.smartway.service.dto;

import com.resteam.smartway.domain.DiningTable;
import com.resteam.smartway.domain.order.OrderDetail;
import com.resteam.smartway.service.dto.order.OrderDetailDTO;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
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
    private Instant payDate;
}
