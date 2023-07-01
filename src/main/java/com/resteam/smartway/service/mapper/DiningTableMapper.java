package com.resteam.smartway.service.mapper;

import com.resteam.smartway.domain.DiningTable;
import com.resteam.smartway.service.dto.DiningTableDTO;
import com.resteam.smartway.service.mapper.base.EntityMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = { ZoneMapper.class, DiningTableMapper.class })
public interface DiningTableMapper extends EntityMapper<DiningTableDTO, DiningTable> {
    DiningTable toEntity(DiningTableDTO dto);

    DiningTableDTO toDto(DiningTable entity);
}
