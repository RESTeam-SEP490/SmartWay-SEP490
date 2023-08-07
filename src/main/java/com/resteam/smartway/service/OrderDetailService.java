package com.resteam.smartway.service;

import com.resteam.smartway.service.dto.order.DetailAddNoteDTO;
import com.resteam.smartway.service.dto.order.OrderDTO;
import com.resteam.smartway.service.dto.order.OrderDetailAdjustQuantityDTO;
import com.resteam.smartway.service.dto.order.OrderDetailDTO;
import java.util.List;
import java.util.UUID;

public interface OrderDetailService {
    OrderDetailDTO addNote(DetailAddNoteDTO detailAddNoteDTO);

    List<OrderDetailDTO> getAllOrderDetails();

    //Hủy món
    void deleteOrderDetail(UUID orderDetailId);
}
