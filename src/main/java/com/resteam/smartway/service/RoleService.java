package com.resteam.smartway.service;

import com.resteam.smartway.service.dto.RoleDTO;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Pageable;

public interface RoleService {
    RoleDTO createRole(RoleDTO roleDTO);

    List<RoleDTO> getAllRoles(Pageable pageable);

    RoleDTO updateRole(RoleDTO roleDTO);

    void deleteRole(UUID id);
}
