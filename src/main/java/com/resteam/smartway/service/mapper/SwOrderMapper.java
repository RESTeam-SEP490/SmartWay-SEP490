package com.resteam.smartway.service.mapper;

import com.resteam.smartway.domain.SwOrder;
import com.resteam.smartway.service.dto.order.SwOrderDTO;
import com.resteam.smartway.service.mapper.base.EntityMapper;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring", uses = { OrderDetailMapper.class, DiningTableMapper.class })
public interface SwOrderMapper extends EntityMapper<SwOrderDTO, SwOrder> {}
