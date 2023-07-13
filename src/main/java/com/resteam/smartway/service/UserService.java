package com.resteam.smartway.service;

import com.resteam.smartway.domain.User;
import com.resteam.smartway.service.dto.StaffDTO;
import com.resteam.smartway.service.dto.TenantRegistrationDTO;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    Optional<User> completePasswordReset(String newPassword, String key);

    Optional<User> requestPasswordReset(String mail);

    void registerUser(TenantRegistrationDTO tenantRegistrationDTO);

    void changePassword(String currentClearTextPassword, String newPassword);

    Optional<User> getUserWithAuthorities();

    List<String> getAuthorities();

    Page<StaffDTO> loadStaffsWithSearch(Pageable pageable, String searchText, List<String> roleIds);

    StaffDTO createStaff(StaffDTO staffDTO);

    StaffDTO updateStaff(StaffDTO staffDTO);

    void deleteStaff(List<String> ids);

    void updateUser(String fullName, String email, String langKey);
}
