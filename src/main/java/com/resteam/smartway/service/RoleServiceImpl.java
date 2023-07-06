package com.resteam.smartway.service;

import com.resteam.smartway.domain.Authority;
import com.resteam.smartway.domain.Role;
import com.resteam.smartway.repository.AuthorityRepository;
import com.resteam.smartway.repository.RoleRepository;
import com.resteam.smartway.service.dto.RoleDTO;
import com.resteam.smartway.service.mapper.RoleMapper;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class RoleServiceImpl implements RoleService {

    private static final String ENTITY_NAME = "role";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RoleRepository roleRepository;
    private final AuthorityRepository authorityRepository;
    private final RoleMapper roleMapper;

    @Override
    public RoleDTO createRole(RoleDTO roleDTO) {
        roleRepository
            .findOneByName(roleDTO.getName())
            .ifPresent(m -> {
                throw new BadRequestAlertException(applicationName, ENTITY_NAME, "existed");
            });

        Collection<Authority> authorityCollections = roleDTO
            .getAuthorities()
            .stream()
            .filter(authorityName -> authorityName.startsWith("PERMISSION_"))
            .map(authorityName ->
                authorityRepository
                    .findById(authorityName)
                    .orElseThrow(() -> new BadRequestAlertException(applicationName, ENTITY_NAME, "existed"))
            )
            .collect(Collectors.toList());
        Role role = new Role(roleDTO.getName(), authorityCollections);

        return roleMapper.toDto(roleRepository.save(role));
    }

    @Override
    public List<RoleDTO> getAllRoles() {
        return roleMapper.toDto(roleRepository.findAll());
    }
}
