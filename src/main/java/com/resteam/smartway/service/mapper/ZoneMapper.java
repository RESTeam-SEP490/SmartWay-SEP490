package com.resteam.smartway.service.mapper;

import com.resteam.smartway.domain.Zone;
import com.resteam.smartway.service.dto.ZoneDTO;
import com.resteam.smartway.service.mapper.base.EntityMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ZoneMapper extends EntityMapper<ZoneDTO, Zone> {}
