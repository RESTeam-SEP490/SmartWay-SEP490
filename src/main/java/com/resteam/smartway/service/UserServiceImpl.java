package com.resteam.smartway.service;

import com.resteam.smartway.domain.Authority;
import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.domain.Role;
import com.resteam.smartway.domain.User;
import com.resteam.smartway.domain.enumeration.CurrencyUnit;
import com.resteam.smartway.repository.AuthorityRepository;
import com.resteam.smartway.repository.RestaurantRepository;
import com.resteam.smartway.repository.RoleRepository;
import com.resteam.smartway.repository.UserRepository;
import com.resteam.smartway.security.AuthoritiesConstants;
import com.resteam.smartway.security.SecurityUtils;
import com.resteam.smartway.security.multitenancy.context.RestaurantContext;
import com.resteam.smartway.service.dto.IsActiveUpdateDTO;
import com.resteam.smartway.service.dto.ProfileDTO;
import com.resteam.smartway.service.dto.StaffDTO;
import com.resteam.smartway.service.dto.TenantRegistrationDTO;
import com.resteam.smartway.service.mapper.ProfileMapper;
import com.resteam.smartway.service.mapper.StaffMapper;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import com.resteam.smartway.web.rest.errors.SubdomainAlreadyUsedException;
import java.io.InputStream;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalUnit;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.security.RandomUtil;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthorityRepository authorityRepository;

    private final RestaurantRepository restaurantRepository;

    private final RoleRepository roleRepository;

    private final StaffMapper staffMapper;

    private final ProfileMapper profileMapper;

    private final StripeService stripeService;

    private final String ENTITY_NAME_STAFF = "username";
    private final String NAME_SHEET_STAFF = "Staff-Manage";
    private final String NAME_SHEET_SECRET_KEY = "Secret_Key";
    private final String CONTENT_KEY_COLUMN_EMPTY = "staff.columnEmpty";

    private final String CONTENT_KEY_SHEET_NAME_INVALID = "staff.sheetInvalidName";
    private final String REGEX_PHONE = "^\\d{5,15}$";
    private final String MESSAGE_PHONE = "staff.messagePhone";
    private final String REGEX_FULL_NAME = "^[p{L}\\D]+$";
    private final String MESSAGE_FULL_NAME = "staff.messageFullName";
    private final String REGEX_EMAIL = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
    private final String MESSAGE_EMAIL = "staff.messageEmail";
    private final String REGEX_PASSWORD = "^[A-za-z0-9]{4,100}$";
    private final String MESSAGE_PASSWORD = "staff.messagePassword";
    private final String REGEX_USERNAME = "^(?=[a-zA-Z0-9._]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$";
    private final String MESSAGE_USERNAME = "staff.messageUsername";
    private final String CONTENT_ROLE_NOT_EXIST = "staff.roleNotExist";
    private static final String SECRET_KEY_ENCRYPT = "lUcV6iYbiEtmXQze5RQf92eJLeJe6LPOFwgP0YRBwJc=";
    private final String CONTENT_USERNAME_EXIST = "staff.usernameExist";
    private final String CONTENT_EMAIL_EXIST = "staff.emailExist";
    private final String ENTITY_USERNAME_PROFILE = "username";
    private final String PASSWORD_EXPIRED = "passwordExpired";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    @Override
    public User completePasswordReset(String newPassword, String key) {
        User changedPasswordUser = userRepository
            .findOneByResetKey(key)
            .filter(user -> user.getResetDate().isAfter(Instant.now().minus(1, ChronoUnit.DAYS)))
            .map(user -> {
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setResetKey(null);
                user.setResetDate(null);
                return user;
            })
            .orElseThrow(() -> new BadRequestAlertException("Token was expired", "user", PASSWORD_EXPIRED));
        return changedPasswordUser;
    }

    @Override
    public Optional<User> requestPasswordReset(String mail, HttpServletRequest request) {
        String subdomain = request.getHeader("host").split("[.]")[0];
        RestaurantContext.setCurrentRestaurantById(subdomain);
        return userRepository
            .findOneByEmailIgnoreCase(mail)
            .map(user -> {
                user.setResetKey(RandomUtil.generateResetKey());
                user.setResetDate(Instant.now());
                userRepository.save(user);
                return user;
            });
    }

    @Override
    @SneakyThrows
    public String registerUser(TenantRegistrationDTO tenantRegistrationDTO) {
        restaurantRepository
            .findOneById(tenantRegistrationDTO.getRestaurantId())
            .ifPresent(r -> {
                throw new SubdomainAlreadyUsedException();
            });

        Restaurant restaurant = new Restaurant();
        restaurant.setId(tenantRegistrationDTO.getRestaurantId());
        restaurant.setPhone(tenantRegistrationDTO.getPhone());
        restaurant.setIsNew(true);
        restaurant.setLangKey(tenantRegistrationDTO.getLangKey());
        restaurant.setPlanExpiry(Instant.now().plus(15, ChronoUnit.DAYS));
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        RestaurantContext.setCurrentRestaurant(savedRestaurant);
        createRole(tenantRegistrationDTO.getLangKey());

        Authority tenantAdminAuth = authorityRepository.findById(AuthoritiesConstants.ROLE_ADMIN).orElse(new Authority());
        Role role = roleRepository.save(new Role("RestaurantAdmin@", List.of(tenantAdminAuth)));

        User newUser = new User();
        String encryptedPassword = passwordEncoder.encode(tenantRegistrationDTO.getPassword());
        newUser.setUsername(tenantRegistrationDTO.getUsername().toLowerCase());
        newUser.setPassword(encryptedPassword);
        newUser.setFullName(tenantRegistrationDTO.getFullName());
        newUser.setEmail(tenantRegistrationDTO.getEmail().toLowerCase());
        newUser.setPhone(tenantRegistrationDTO.getPhone());
        newUser.setRole(role);
        User savedUser = userRepository.save(newUser);

        String customerId = stripeService.createStripeCustomer(savedRestaurant.getId() + ".smart-way.website", savedUser.getEmail());
        savedRestaurant.setOwner(savedUser);
        savedRestaurant.setStripeCustomerId(customerId);
        restaurantRepository.save(savedRestaurant);

        return savedRestaurant.getId();
    }

    private void createRole(String langkey) {
        List<String> roleNames;
        if (langkey.equals("vi")) {
            roleNames = List.of("Bồi bàn", "Thu ngân", "Quản lý");
        } else roleNames = List.of("Waiter", "Cashier", "Manager");

        Role waiter = new Role();
        waiter.setName(roleNames.get(0));
        Authority authority = authorityRepository.findById(AuthoritiesConstants.ORDER_ADD_AND_CANCEL).orElseThrow();
        Authority authorityUser = authorityRepository.findById(AuthoritiesConstants.ROLE_USER).orElseThrow();
        waiter.setAuthorities(List.of(authority, authorityUser));

        Role cashier = new Role();
        cashier.setName(roleNames.get(1));
        List<Authority> authorityList1 = AuthoritiesConstants.DEFAULT_CASHIER_AUTHORITIES
            .stream()
            .map(name -> authorityRepository.findById(name).orElseThrow())
            .collect(Collectors.toList());
        cashier.setAuthorities(authorityList1);

        Role manager = new Role();
        manager.setName(roleNames.get(2));
        List<Authority> authorityList2 = AuthoritiesConstants.DEFAULT_MANAGER_AUTHORITIES
            .stream()
            .map(name -> authorityRepository.findById(name).orElseThrow())
            .collect(Collectors.toList());
        manager.setAuthorities(authorityList2);

        roleRepository.saveAll(List.of(waiter, cashier, manager));
    }

    @Transactional
    @Override
    public void changePassword(String currentClearTextPassword, String newPassword) {
        SecurityUtils
            .getCurrentUsername()
            .flatMap(userRepository::findOneByUsername)
            .ifPresent(user -> {
                String currentEncryptedPassword = user.getPassword();
                if (!passwordEncoder.matches(currentClearTextPassword, currentEncryptedPassword)) {
                    throw new InvalidPasswordException();
                }
                String encryptedPassword = passwordEncoder.encode(newPassword);
                user.setPassword(encryptedPassword);
                log.debug("Changed password for User: {}", user);
            });
    }

    @Transactional(readOnly = true)
    @Override
    public Optional<User> getUserWithAuthorities() {
        String username = SecurityUtils.getCurrentUsername().orElseThrow(() -> new UsernameNotFoundException(("Username must be provide")));

        return userRepository.findOneWithAuthoritiesByUsername(username);
    }

    @Override
    public ProfileDTO getUserProfile() {
        String username = SecurityUtils.getCurrentUsername().orElseThrow(() -> new UsernameNotFoundException(("Username must be provide")));
        User userOptional = userRepository
            .findOneByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException(("Username not fond")));
        //        userOptional.setPassword(null);
        ProfileDTO profileDTO = profileMapper.toDto(userOptional);
        profileDTO.setBirthday(userOptional.getBirthday());
        return profileDTO;
    }

    @Transactional(readOnly = true)
    @Override
    public List<String> getAuthorities() {
        return authorityRepository.findAll().stream().map(Authority::getName).collect(Collectors.toList());
    }

    @Override
    public Page<StaffDTO> loadStaffsWithSearch(Pageable pageable, String searchText, List<String> roleIds, Boolean isActive) {
        if (searchText != null) searchText = searchText.toLowerCase();
        List<UUID> roleUUIDList = null;
        if (roleIds != null && roleIds.size() > 0) roleUUIDList = roleIds.stream().map(UUID::fromString).collect(Collectors.toList());
        Page<User> userPage = userRepository.findWithFilterParams(searchText, roleUUIDList, isActive, pageable);
        return userPage.map(item -> {
            StaffDTO staffDTO = staffMapper.toDto(item);
            return staffDTO;
        });
    }

    @SneakyThrows
    @Override
    public StaffDTO createStaff(StaffDTO staffDTO) {
        Optional<User> existingStaff = userRepository.findOneByUsername(staffDTO.getUsername());
        if (existingStaff.isPresent()) {
            throw new BadRequestAlertException(applicationName, ENTITY_NAME_STAFF, "existed");
        }

        User staff = staffMapper.toEntity(staffDTO);
        String encryptedPassword = passwordEncoder.encode(staffDTO.getPassword());
        staff.setPassword(encryptedPassword);

        User savedStaff = userRepository.save(staff);
        return staffMapper.toDto(savedStaff);
    }

    @Override
    public StaffDTO updateStaff(StaffDTO staffDTO) {
        User staff = userRepository
            .findById(staffDTO.getId())
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ENTITY_NAME_STAFF, " id not found"));
        Optional<User> existingStaff = userRepository.findOneByUsername(staffDTO.getUsername());
        if (existingStaff.isPresent() && !existingStaff.get().getId().equals(staffDTO.getId())) {
            throw new BadRequestAlertException(applicationName, ENTITY_NAME_STAFF, "existed");
        }
        staffMapper.partialUpdate(staff, staffDTO);
        if (staffDTO.getPassword() != null) {
            String encryptedPassword = passwordEncoder.encode(staffDTO.getPassword());
            staff.setPassword(encryptedPassword);
        }
        User result = userRepository.save(staff);
        return staffMapper.toDto(result);
    }

    @Override
    public void deleteStaff(List<String> ids) {
        List<User> staffIdList = ids
            .stream()
            .map(id -> {
                if (id == null) throw new BadRequestAlertException("Invalid id", ENTITY_NAME_STAFF, "id null");
                return userRepository
                    .findById(UUID.fromString(id))
                    .orElseThrow(() -> new BadRequestAlertException("Invalid id", ENTITY_NAME_STAFF, "id null"));
            })
            .collect(Collectors.toList());
        userRepository.deleteAll(staffIdList);
    }

    @Override
    public void updateUser(String fullName, String email, String langKey) {
        SecurityUtils
            .getCurrentUsername()
            .flatMap(userRepository::findOneByUsername)
            .ifPresent(user -> {
                user.setFullName(fullName);
                if (email != null) {
                    user.setEmail(email.toLowerCase());
                }
                log.debug("Changed Information for User: {}", user);
            });
    }

    public ProfileDTO updateProfile(ProfileDTO profileDTO) {
        User profile = userRepository
            .findById(profileDTO.getId())
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ENTITY_USERNAME_PROFILE, " id not found"));

        profile.setBirthday(profileDTO.getBirthday());
        profileMapper.partialUpdate(profile, profileDTO);
        if (profileDTO.getResetPassword() != null && profileDTO.getPassword() != null) {
            if (Objects.equals(profileDTO.getPassword(), profile.getPassword())) {
                String encryptedPassword = passwordEncoder.encode(profileDTO.getResetPassword());
                profile.setPassword(encryptedPassword);
            }
        }
        User result = userRepository.save(profile);
        return profileMapper.toDto(result);
    }

    @Override
    public Map<String, String> importStaff(InputStream is) {
        Map<String, String> errorMap = new HashMap<>();
        List<User> staffList = new ArrayList<>();
        boolean noUpload = false;
        try {
            String secretKeyInFile = null;
            XSSFWorkbook workbook = new XSSFWorkbook(is);
            XSSFSheet sheetSecretKey = workbook.getSheet(NAME_SHEET_SECRET_KEY);
            if (sheetSecretKey != null) {
                Row row = sheetSecretKey.getRow(1);
                if (row != null) {
                    Cell cell = row.getCell(1);
                    if (cell != null && cell.getCellType() == CellType.STRING) {
                        secretKeyInFile = cell.getStringCellValue();
                    }
                }
            }

            if (secretKeyInFile == null) {
                errorMap.put("staff.nullSecretKey", "");
                return errorMap;
            }

            if (checkSecretKey(secretKeyInFile)) {
                XSSFSheet sheet = workbook.getSheet(NAME_SHEET_STAFF);
                int rowNumber = 0;
                Iterator<Row> iterator = sheet.iterator();
                List<String> listEmailInFile = new ArrayList<>();
                List<String> listUsernameInFile = new ArrayList<>();
                while (iterator.hasNext()) {
                    Row row = iterator.next();
                    if (rowNumber == 0) {
                        rowNumber++;
                        continue;
                    }

                    Iterator<Cell> cells = row.iterator();
                    User staff = new User();
                    boolean isRoleChecked = false;
                    boolean isUsernameChecked = false;
                    boolean isEmailChecked = false;
                    List<String> keysToRemove = new ArrayList<>();
                    while (cells.hasNext()) {
                        Cell cell = cells.next();
                        switch (cell.getColumnIndex()) {
                            case 0:
                                Optional<User> optionalUser = userRepository.findOneByUsername(cell.getStringCellValue().trim());
                                if (optionalUser.isPresent()) {
                                    noUpload = true;
                                    isUsernameChecked = true;
                                    StringBuilder columnName = new StringBuilder(getColumnLabel(1));
                                    errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), CONTENT_USERNAME_EXIST);
                                    keysToRemove.add(getColumnLabel(1) + (rowNumber + 1));
                                } else {
                                    isUsernameChecked = true;
                                    staff.setUsername(cell.getStringCellValue().trim());
                                }
                                break;
                            case 1:
                                staff.setPassword(cell.getStringCellValue().trim());
                                break;
                            case 2:
                                staff.setFullName(cell.getStringCellValue().trim());
                                break;
                            case 3:
                                Optional<User> optionalEmail = userRepository.findOneByEmailIgnoreCase(cell.getStringCellValue().trim());
                                if (optionalEmail.isPresent()) {
                                    noUpload = true;
                                    isEmailChecked = true;
                                    StringBuilder columnName = new StringBuilder(getColumnLabel(4));
                                    errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), CONTENT_EMAIL_EXIST);
                                    keysToRemove.add(getColumnLabel(4) + (rowNumber + 1));
                                } else {
                                    isEmailChecked = true;
                                    staff.setEmail(cell.getStringCellValue().trim());
                                }
                                break;
                            case 4:
                                staff.setPhone(cell.getStringCellValue().trim());
                                break;
                            case 5:
                                Optional<Role> currentRole = roleRepository.findOneByName(cell.getStringCellValue().trim());
                                if (currentRole.isPresent()) {
                                    staff.setRole(currentRole.get());
                                } else {
                                    isRoleChecked = true;
                                    noUpload = true;
                                    StringBuilder columnName = new StringBuilder(getColumnLabel(6));
                                    errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), CONTENT_ROLE_NOT_EXIST);
                                    keysToRemove.add(getColumnLabel(6) + (rowNumber + 1));
                                }
                                break;
                            default:
                                break;
                        }
                    }
                    boolean isValidated = true;

                    if (
                        (staff.getUsername() == null || staff.getUsername().equals("")) &&
                        (staff.getPassword() == null || staff.getPassword().equals("")) &&
                        (staff.getFullName() == null || staff.getFullName().equals("")) &&
                        (staff.getEmail() == null || staff.getEmail().equals("")) &&
                        (staff.getPhone() == null || staff.getPhone().equals("")) &&
                        (staff.getRole() == null || staff.getRole().getName().equals(""))
                    ) {
                        if (staffList.isEmpty()) {
                            if (errorMap.isEmpty()) {
                                errorMap.put("Staff.xlsx ", "staff.emptyFileName");
                            }
                            if (rowNumber == 2) {
                                for (String key : keysToRemove) {
                                    errorMap.remove(key);
                                }
                            }
                        } else {
                            for (String key : keysToRemove) {
                                errorMap.remove(key);
                            }
                        }
                        break;
                    }

                    if (staff.getUsername() == null) {
                        if (!isUsernameChecked) {
                            isValidated = false;
                            StringBuilder columnName = new StringBuilder(getColumnLabel(1));
                            errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), CONTENT_KEY_COLUMN_EMPTY);
                            keysToRemove.add(getColumnLabel(1) + (rowNumber + 1));
                            noUpload = true;
                        }
                    } else {
                        if (!Pattern.matches(REGEX_USERNAME, staff.getUsername())) {
                            isValidated = false;
                            noUpload = true;
                            StringBuilder columnName = new StringBuilder(getColumnLabel(1));
                            errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), MESSAGE_USERNAME);
                            keysToRemove.add(getColumnLabel(1) + (rowNumber + 1));
                        }

                        if (staff.getUsername().equals("")) {
                            isValidated = false;
                            StringBuilder columnName = new StringBuilder(getColumnLabel(1));
                            errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), CONTENT_KEY_COLUMN_EMPTY);
                            keysToRemove.add(getColumnLabel(1) + (rowNumber + 1));
                            noUpload = true;
                        }
                    }

                    if (staff.getPassword() == null) {
                        isValidated = false;
                        StringBuilder columnName = new StringBuilder(getColumnLabel(2));
                        errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), CONTENT_KEY_COLUMN_EMPTY);
                        keysToRemove.add(getColumnLabel(2) + (rowNumber + 1));
                        noUpload = true;
                    } else {
                        if (!Pattern.matches(REGEX_PASSWORD, staff.getPassword())) {
                            isValidated = false;
                            noUpload = true;
                            StringBuilder columnName = new StringBuilder(getColumnLabel(2));
                            errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), MESSAGE_PASSWORD);
                            keysToRemove.add(getColumnLabel(2) + (rowNumber + 1));
                        }

                        if (staff.getPassword().equals("")) {
                            isValidated = false;
                            StringBuilder columnName = new StringBuilder(getColumnLabel(2));
                            errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), CONTENT_KEY_COLUMN_EMPTY);
                            keysToRemove.add(getColumnLabel(2) + (rowNumber + 1));
                            noUpload = true;
                        }
                    }

                    if (staff.getFullName() == null) {
                        isValidated = false;
                        StringBuilder columnName = new StringBuilder(getColumnLabel(3));
                        errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), CONTENT_KEY_COLUMN_EMPTY);
                        keysToRemove.add(getColumnLabel(3) + (rowNumber + 1));
                        noUpload = true;
                    } else {
                        if (!Pattern.matches(REGEX_FULL_NAME, staff.getFullName())) {
                            isValidated = false;
                            noUpload = true;
                            StringBuilder columnName = new StringBuilder(getColumnLabel(3));
                            errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), MESSAGE_FULL_NAME);
                            keysToRemove.add(getColumnLabel(3) + (rowNumber + 1));
                        }
                        if (staff.getFullName().equals("")) {
                            isValidated = false;
                            StringBuilder columnName = new StringBuilder(getColumnLabel(3));
                            errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), CONTENT_KEY_COLUMN_EMPTY);
                            keysToRemove.add(getColumnLabel(3) + (rowNumber + 1));
                            noUpload = true;
                        }
                    }

                    if (staff.getEmail() == null) {
                        if (!isEmailChecked) {
                            isValidated = false;
                            StringBuilder columnName = new StringBuilder(getColumnLabel(4));
                            errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), CONTENT_KEY_COLUMN_EMPTY);
                            keysToRemove.add(getColumnLabel(4) + (rowNumber + 1));
                            noUpload = true;
                        }
                    } else {
                        if (!Pattern.matches(REGEX_EMAIL, staff.getEmail())) {
                            isValidated = false;
                            noUpload = true;
                            StringBuilder columnName = new StringBuilder(getColumnLabel(4));
                            errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), MESSAGE_EMAIL);
                            keysToRemove.add(getColumnLabel(4) + (rowNumber + 1));
                        }
                        if (staff.getEmail().equals("")) {
                            isValidated = false;
                            StringBuilder columnName = new StringBuilder(getColumnLabel(4));
                            errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), CONTENT_KEY_COLUMN_EMPTY);
                            keysToRemove.add(getColumnLabel(4) + (rowNumber + 1));
                            noUpload = true;
                        }
                    }

                    if (staff.getPhone() != null) {
                        if (!staff.getPhone().equals("")) {
                            if (!Pattern.matches(REGEX_PHONE, staff.getPhone())) {
                                isValidated = false;
                                noUpload = true;
                                StringBuilder columnName = new StringBuilder(getColumnLabel(5));
                                errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), MESSAGE_PHONE);
                                keysToRemove.add(getColumnLabel(5) + (rowNumber + 1));
                            }
                        }
                    }

                    if (staff.getRole() == null) {
                        if (!isRoleChecked) {
                            isValidated = false;
                            noUpload = true;
                            StringBuilder columnName = new StringBuilder(getColumnLabel(6));
                            errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), CONTENT_KEY_COLUMN_EMPTY);
                            keysToRemove.add(getColumnLabel(6) + (rowNumber + 1));
                        }
                    }

                    boolean isDuplicateUsername = listUsernameInFile.stream().anyMatch(s -> s.equals(staff.getUsername()));
                    if (isDuplicateUsername) {
                        isValidated = false;
                        noUpload = true;
                        StringBuilder columnName = new StringBuilder(getColumnLabel(1));
                        errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), CONTENT_USERNAME_EXIST);
                    } else {
                        listUsernameInFile.add(staff.getUsername());
                    }

                    boolean isDuplicateEmail = listEmailInFile.stream().anyMatch(s -> s.equals(staff.getEmail()));
                    if (isDuplicateEmail) {
                        isValidated = false;
                        noUpload = true;
                        StringBuilder columnName = new StringBuilder(getColumnLabel(4));
                        errorMap.put(String.valueOf(columnName.append(rowNumber + 1)), CONTENT_EMAIL_EXIST);
                    } else {
                        listEmailInFile.add(staff.getEmail());
                    }

                    if (isValidated) {
                        String encryptedPassword = passwordEncoder.encode(staff.getPassword());
                        staff.setPassword(encryptedPassword);
                        staff.setIsActive(true);
                        staffList.add(staff);
                    }
                    rowNumber++;
                }

                if (!noUpload) {
                    if (staffList.isEmpty()) {
                        errorMap.put("Staff.xlsx ", "staff.emptyFileName");
                    } else {
                        userRepository.saveAll(staffList);
                    }
                }
            } else {
                errorMap.put("staff.invalidSecretKey", "");
                return errorMap;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return errorMap;
    }

    @Override
    public void updateIsActiveStaff(IsActiveUpdateDTO isActiveUpdateDTO) {
        List<User> staffList = isActiveUpdateDTO
            .getIds()
            .stream()
            .map(id -> {
                if (id == null) throw new BadRequestAlertException("Invalid id", ENTITY_NAME_STAFF, "idnull");
                User staff = userRepository
                    .findById(UUID.fromString(id))
                    .orElseThrow(() -> new BadRequestAlertException("Invalid ID", ENTITY_NAME_STAFF, "idnotfound"));
                staff.setIsActive(isActiveUpdateDTO.getIsActive());
                return staff;
            })
            .collect(Collectors.toList());
        userRepository.saveAll(staffList);
    }

    private String getColumnLabel(int column) {
        StringBuilder label = new StringBuilder();
        while (column > 0) {
            column--;
            label.insert(0, (char) ('A' + (column % 26)));
            column /= 26;
        }
        return label.toString();
    }

    private boolean checkSecretKey(String secretKey) {
        return secretKey.equals(SECRET_KEY_ENCRYPT);
    }

    @Override
    public User findUserByRestaurantId(String id) {
        return userRepository.findUserByRestaurantId(id);
    }
}
