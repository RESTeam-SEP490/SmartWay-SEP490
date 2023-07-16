package com.resteam.smartway.service.mapper;

import com.resteam.smartway.domain.SwOrder;
import com.resteam.smartway.service.dto.SwOrderDTO;
import com.resteam.smartway.service.mapper.base.EntityMapper;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring", uses = { SwOrderMapper.class })
public interface SwOrderMapper extends EntityMapper<SwOrderDTO, SwOrder> {
    SwOrder toEntity(SwOrderDTO dto);

    SwOrderDTO toDto(SwOrder entity);
}
