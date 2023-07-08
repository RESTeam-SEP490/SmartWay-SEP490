package com.resteam.smartway.web.rest;

import com.resteam.smartway.domain.User;
import com.resteam.smartway.service.InvalidPasswordException;
import com.resteam.smartway.service.StaffService;
import com.resteam.smartway.service.dto.StaffDTO;
import com.resteam.smartway.web.rest.vm.ManagedUserVM;
import java.util.List;
import javax.validation.Valid;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@Transactional
public class StaffController {

    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    @GetMapping("/staffs")
    public ResponseEntity<List<User>> getAllStaff() {
        List<User> staffList = staffService.listStaff();
        return new ResponseEntity<>(staffList, HttpStatus.OK);
    }

    @PostMapping("/staffs/create")
    @ResponseStatus(HttpStatus.CREATED)
    public void createStaff(@Valid @RequestBody StaffDTO staffDTO) {
        if (isPasswordLengthInvalid(staffDTO.getPassword())) {
            throw new InvalidPasswordException();
        }
        staffService.createStaff(staffDTO);
    }

    private static boolean isPasswordLengthInvalid(String password) {
        return (
            StringUtils.isEmpty(password) ||
            password.length() < ManagedUserVM.PASSWORD_MIN_LENGTH ||
            password.length() > ManagedUserVM.PASSWORD_MAX_LENGTH
        );
    }
}
