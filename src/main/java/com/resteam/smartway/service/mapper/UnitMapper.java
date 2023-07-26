package com.resteam.smartway.service.mapper;

import com.resteam.smartway.domain.Unit;
import com.resteam.smartway.service.dto.UnitDTO;
import com.resteam.smartway.service.mapper.base.EntityMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UnitMapper extends EntityMapper<UnitDTO, Unit> {}
