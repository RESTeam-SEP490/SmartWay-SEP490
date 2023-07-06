package com.resteam.smartway.service;

import com.resteam.smartway.service.dto.RoleDTO;
import java.util.List;

public interface RoleService {
    RoleDTO createRole(RoleDTO roleDTO);

    List<RoleDTO> getAllRoles();
}
