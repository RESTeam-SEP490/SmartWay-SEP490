package com.resteam.smartway.service.mapper;

import com.resteam.smartway.domain.User;
import com.resteam.smartway.service.dto.ProfileDTO;
import com.resteam.smartway.service.mapper.base.EntityMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProfileMapper extends EntityMapper<ProfileDTO, User> {
    User toEntity(ProfileDTO dto);

    ProfileDTO toDto(User entity);
}
