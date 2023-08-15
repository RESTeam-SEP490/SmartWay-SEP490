package com.resteam.smartway.service;

import com.resteam.smartway.domain.User;
import com.resteam.smartway.service.dto.IsActiveUpdateDTO;
import com.resteam.smartway.service.dto.ProfileDTO;
import com.resteam.smartway.service.dto.StaffDTO;
import com.resteam.smartway.service.dto.TenantRegistrationDTO;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    User completePasswordReset(String newPassword, String key);

    Optional<User> requestPasswordReset(String mail, HttpServletRequest request);

    String registerUser(TenantRegistrationDTO tenantRegistrationDTO);

    void changePassword(String currentClearTextPassword, String newPassword);

    Optional<User> getUserWithAuthorities();

    ProfileDTO getUserProfile();

    List<String> getAuthorities();

    Page<StaffDTO> loadStaffsWithSearch(Pageable pageable, String searchText, List<String> roleIds, Boolean isActive);

    StaffDTO createStaff(StaffDTO staffDTO);

    StaffDTO updateStaff(StaffDTO staffDTO);

    void deleteStaff(List<String> ids);

    void updateUser(String fullName, String email, String langKey);

    ProfileDTO updateProfile(ProfileDTO profileDTO);

    Map<String, String> importStaff(InputStream is);

    void updateIsActiveStaff(IsActiveUpdateDTO isActiveUpdateDTO);

    User findUserByRestaurantId(String id);
}
