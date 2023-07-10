package com.resteam.smartway.service;

import com.resteam.smartway.domain.Role;
import com.resteam.smartway.service.dto.MenuItemDTO;
import com.resteam.smartway.service.dto.RoleDTO;
import java.util.List;
import lombok.SneakyThrows;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

public interface RoleService {
    List<RoleDTO> getAllRole();

    @SneakyThrows
    RoleDTO createRole(@RequestBody RoleDTO roleDTO);
}
