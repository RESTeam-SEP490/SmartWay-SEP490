package com.resteam.smartway.web.rest;

import static com.resteam.smartway.web.rest.AccountResource.isPasswordLengthInvalid;

import com.resteam.smartway.service.UserService;
import com.resteam.smartway.service.dto.PasswordChangeDTO;
import com.resteam.smartway.service.dto.ProfileDTO;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import com.resteam.smartway.web.rest.errors.InvalidPasswordException;
import java.util.Objects;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TenantResource {

    private final UserService userService;

    private final String ENTITY_TENANT_PROFILE = "tenant";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    @GetMapping("/tenant-profile")
    public ProfileDTO getProfile() {
        ProfileDTO profileDTO = userService.getUserProfile();
        profileDTO.setPassword(null);
        return profileDTO;
    }

    @PutMapping("/tenant-profile/{id}")
    public ResponseEntity<ProfileDTO> updateProfile(
        @PathVariable(value = "id") final String id,
        @Valid @RequestBody ProfileDTO profileDTO
    ) {
        if (profileDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_TENANT_PROFILE, "id null");
        }
        if (!Objects.equals(id, profileDTO.getId().toString())) {
            throw new BadRequestAlertException("Invalid id", ENTITY_TENANT_PROFILE, "id invalid");
        }
        ProfileDTO result = userService.updateProfile(profileDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_TENANT_PROFILE, result.getId().toString()))
            .body(result);
    }

    @PutMapping(path = "/tenant-profile/change-password")
    public void changePassword(@RequestBody PasswordChangeDTO passwordChangeDto) {
        if (isPasswordLengthInvalid(passwordChangeDto.getNewPassword())) {
            throw new InvalidPasswordException();
        }
        userService.changePassword(passwordChangeDto.getCurrentPassword(), passwordChangeDto.getNewPassword());
    }
}
