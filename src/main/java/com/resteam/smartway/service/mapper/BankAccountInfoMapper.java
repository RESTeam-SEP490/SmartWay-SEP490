package com.resteam.smartway.service.mapper;

import com.resteam.smartway.domain.BankAccountInfo;
import com.resteam.smartway.service.dto.BankAccountInfoDTO;
import com.resteam.smartway.service.mapper.base.EntityMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BankAccountInfoMapper extends EntityMapper<BankAccountInfoDTO, BankAccountInfo> {
    BankAccountInfo toEntity(BankAccountInfoDTO dto);

    //    @Mapping(target = "isDefaultAccount", source = "isDefault")
    BankAccountInfoDTO toDto(BankAccountInfo entity);
}
