package com.resteam.smartway.service.mapper;

import com.resteam.smartway.domain.order.SwOrder;
import com.resteam.smartway.service.dto.BillDTO;
import com.resteam.smartway.service.mapper.base.EntityMapper;
import com.resteam.smartway.service.mapper.order.OrderDetailMapper;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring", uses = { OrderDetailMapper.class, DiningTableMapper.class })
public interface BillMapper extends EntityMapper<BillDTO, SwOrder> {}
