package com.resteam.smartway.service;

import com.resteam.smartway.domain.MenuItem;
import com.resteam.smartway.domain.order.OrderDetail;
import com.resteam.smartway.domain.order.SwOrder;
import com.resteam.smartway.repository.MenuItemRepository;
import com.resteam.smartway.repository.order.OrderDetailRepository;
import com.resteam.smartway.repository.order.OrderRepository;
import com.resteam.smartway.service.dto.order.DetailAddNoteDTO;
import com.resteam.smartway.service.dto.order.OrderDetailDTO;
import com.resteam.smartway.service.mapper.order.OrderDetailMapper;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class OrderDetailServiceImpl implements OrderDetailService {

    private final OrderDetailRepository orderDetailRepository;
    private final OrderDetailMapper orderDetailMapper;
    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private static final String ENTITY_NAME = "orderDetail";
    private static final String MENUITEM = "menuItem";
    private static final String ORDER = "order";

    @Override
    public OrderDetailDTO addNote(DetailAddNoteDTO detailAddNoteDTO) {
        OrderDetail orderDetail = orderDetailRepository
            .findById(detailAddNoteDTO.getOrderDetailId())
            .orElseThrow(() -> new BadRequestAlertException("Order detail not found", ENTITY_NAME, "idnotfound"));

        orderDetail.setNote(detailAddNoteDTO.getNote());
        OrderDetail updatedOrderDetail = orderDetailRepository.save(orderDetail);
        return orderDetailMapper.toDto(updatedOrderDetail);
    }

    @Override
    public List<OrderDetailDTO> getAllOrderDetails() {
        List<OrderDetail> orderDetails = orderDetailRepository.findAll();
        return orderDetailMapper.toDto(orderDetails);
    }

    @Override
    public void deleteOrderDetail(UUID orderDetailId) {
        OrderDetail orderDetail = orderDetailRepository
            .findById(orderDetailId)
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
        orderDetailRepository.delete(orderDetail);
    }
}
