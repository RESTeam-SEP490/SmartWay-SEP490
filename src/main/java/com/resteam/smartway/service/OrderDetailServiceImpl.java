package com.resteam.smartway.service;

import com.amazonaws.services.kms.model.NotFoundException;
import com.resteam.smartway.domain.OrderDetail;
import com.resteam.smartway.repository.OrderDetailRepository;
import com.resteam.smartway.service.dto.OrderDetailDTO;
import com.resteam.smartway.service.mapper.OrderDetailMapper;
import java.util.List;
import java.util.Optional;
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

    @Override
    public OrderDetailDTO getOrderDetailById(UUID orderDetailId) {
        OrderDetail orderDetail = orderDetailRepository
            .findById(orderDetailId)
            .orElseThrow(() -> new NotFoundException("Order detail not found with ID: " + orderDetailId));
        return orderDetailMapper.toDto(orderDetail);
    }

    private String generateCode() {
        Optional<OrderDetail> lastOrderDetail = orderDetailRepository.findTopByOrderByCodeDesc();

        if (lastOrderDetail.isEmpty()) return "ODe000001"; else {
            String lastCode = lastOrderDetail.get().getCode();
            int nextCodeInt = Integer.parseInt(lastCode.substring(2)) + 1;
            if (nextCodeInt > 999999) throw new IllegalStateException("Maximum Code reached");
            return String.format("OD%06d", nextCodeInt);
        }
    }

    @Override
    public List<OrderDetailDTO> getAllOrderDetails() {
        List<OrderDetail> orderDetails = orderDetailRepository.findAll();
        return orderDetailMapper.toDtoList(orderDetails);
    }

    @Override
    public void createOrderDetail(OrderDetailDTO orderDetailDTO) {
        OrderDetail orderDetail = orderDetailMapper.toEntity(orderDetailDTO);
        orderDetailRepository.save(orderDetail);
    }

    @Override
    public void updateOrderDetail(OrderDetailDTO orderDetailDTO) {
        return;
    }

    @Override
    public void deleteOrderDetail(UUID orderDetailId) {
        OrderDetail orderDetail = orderDetailRepository
            .findById(orderDetailId)
            .orElseThrow(() -> new NotFoundException("Order detail not found with ID: " + orderDetailId));
        orderDetailRepository.delete(orderDetail);
    }
}
