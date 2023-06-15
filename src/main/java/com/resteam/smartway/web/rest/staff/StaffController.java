package com.resteam.smartway.web.rest.staff;

import com.resteam.smartway.domain.User;
import com.resteam.smartway.service.StaffService;
import com.resteam.smartway.service.dto.StaffDTO;
import com.resteam.smartway.web.rest.errors.SubdomainAlreadyUsedException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
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
    public void saveStaff(@RequestBody StaffDTO staffDTO) {
        Optional<User> currentStaff = staffService.getStaffByUsername(staffDTO.getUsername());
        if (currentStaff.isPresent()) {
            throw new SubdomainAlreadyUsedException();
        }
        staffService.createStaff(staffDTO);
    }
}
