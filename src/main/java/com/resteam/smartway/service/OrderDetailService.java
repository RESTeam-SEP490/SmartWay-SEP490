package com.resteam.smartway.service;

import com.resteam.smartway.service.dto.OrderDetailDTO;
import java.util.List;
import java.util.UUID;

public interface OrderDetailService {
    OrderDetailDTO getOrderDetailById(UUID orderDetailId);

    List<OrderDetailDTO> getAllOrderDetails();

    void createOrderDetail(OrderDetailDTO orderDetailDTO);

    void updateOrderDetail(OrderDetailDTO orderDetailDTO);

    //Hủy món
    void deleteOrderDetail(UUID orderDetailId);
}
