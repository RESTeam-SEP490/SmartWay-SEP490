package com.resteam.smartway.web.rest.staff;

import com.resteam.smartway.domain.User;
import com.resteam.smartway.service.InvalidPasswordException;
import com.resteam.smartway.service.StaffService;
import com.resteam.smartway.service.dto.StaffDTO;
import com.resteam.smartway.web.rest.errors.SubdomainAlreadyUsedException;
import com.resteam.smartway.web.rest.vm.ManagedUserVM;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import javax.validation.Valid;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/huy/staff")
public class StaffController {

    private final StaffService staffService;

    public ModelMap modelMap;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllStaff() {
        List<User> staffList = staffService.getAllStaff();
        return new ResponseEntity<>(staffList, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getStaffById(@PathVariable("id") UUID id) {
        Optional<User> currentStaff = staffService.getStaffById(id);
        return currentStaff
            .map(user -> new ResponseEntity<>(user, HttpStatus.OK))
            .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/create")
    public void createStaff(@Valid @RequestBody StaffDTO staffDTO) {
        if (isPasswordLengthInvalid(staffDTO.getPassword())) {
            throw new InvalidPasswordException();
        }
        staffService.createStaff(staffDTO);
    }

    @PutMapping("/update")
    public void updateStaff(@Valid @RequestBody StaffDTO staffDTO) {
        if (isPasswordLengthInvalid(staffDTO.getPassword())) {
            throw new InvalidPasswordException();
        }
        staffService.updateStaff(staffDTO);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<User> deleteStaff(@PathVariable UUID id) {
        Optional<User> staff = staffService.getStaffById(id);
        if (staff.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            staffService.deleteById(id);
            return new ResponseEntity<>(staff.get(), HttpStatus.OK);
        }
    }

    private static boolean isPasswordLengthInvalid(String password) {
        return (
            StringUtils.isEmpty(password) ||
            password.length() < ManagedUserVM.PASSWORD_MIN_LENGTH ||
            password.length() > ManagedUserVM.PASSWORD_MAX_LENGTH
        );
    }
}
