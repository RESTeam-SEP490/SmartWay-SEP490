package com.resteam.smartway.service.dto;

import java.util.List;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoleDTO {

    private UUID id;
    private String name;
    private List<String> authorities;
}
