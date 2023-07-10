package com.resteam.smartway.service;

import com.resteam.smartway.domain.Role;
import com.resteam.smartway.repository.RoleRepository;
import com.resteam.smartway.service.dto.RoleDTO;
import com.resteam.smartway.service.mapper.RoleMapper;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.util.List;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Log4j2
@Transactional
@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    private final RoleMapper roleMapper;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private static final String ENTITY_NAME = "role";

    @Override
    public List<RoleDTO> getAllRole() {
        List<Role> roleList = roleRepository.findAllBy();
        return roleMapper.toDto(roleList);
    }

    @Override
    public RoleDTO createRole(RoleDTO roleDTO) {
        roleRepository
            .findOneByName(roleDTO.getName())
            .ifPresent(r -> {
                throw new BadRequestAlertException(applicationName, ENTITY_NAME, "existed");
            });

        Role role = roleMapper.toEntity(roleDTO);
        return roleMapper.toDto(roleRepository.save(role));
    }
}
