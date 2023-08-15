package com.resteam.smartway.web.rest;

import com.resteam.smartway.domain.User;
import com.resteam.smartway.repository.UserRepository;
import com.resteam.smartway.security.SecurityUtils;
import com.resteam.smartway.security.multitenancy.context.RestaurantContext;
import com.resteam.smartway.service.MailService;
import com.resteam.smartway.service.UserService;
import com.resteam.smartway.service.dto.AdminUserDTO;
import com.resteam.smartway.service.dto.PasswordChangeDTO;
import com.resteam.smartway.service.dto.TenantRegistrationDTO;
import com.resteam.smartway.web.rest.errors.EmailAlreadyUsedException;
import com.resteam.smartway.web.rest.errors.InvalidPasswordException;
import com.resteam.smartway.web.rest.vm.KeyAndPasswordVM;
import com.resteam.smartway.web.rest.vm.ManagedUserVM;
import java.net.URI;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing the current user's account.
 */
@RestController
@RequestMapping("/api")
public class AccountResource {

    private static class AccountResourceException extends RuntimeException {

        private AccountResourceException(String message) {
            super(message);
        }
    }

    private final Logger log = LoggerFactory.getLogger(AccountResource.class);

    private final UserRepository userRepository;

    private final UserService userService;

    private final MailService mailService;

    private final String NOT_FOUND_EMAIL = "reset.notFoundEmail";
    private final String PASSWORD_EXPIRED = "reset.passwordExpired";
    private final String LENGTH_INVALID = "reset.lengthInvalid";

    public AccountResource(UserRepository userRepository, UserService userService, MailService mailService) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.mailService = mailService;
    }

    @PostMapping("/register")
    public ResponseEntity<Void> registerAccount(@Valid @RequestBody TenantRegistrationDTO tenantRegistrationDTO) {
        if (isPasswordLengthInvalid(tenantRegistrationDTO.getPassword())) {
            throw new InvalidPasswordException();
        }
        String restaurantId = userService.registerUser(tenantRegistrationDTO);
        return ResponseEntity.created(URI.create(restaurantId)).build();
    }

    /**
     * {@code GET  /activate} : activate the registered user.
     *
     * @param key the activation key.
     * @throws RuntimeException {@code 500 (Internal Server Error)} if the user couldn't be activated.
     */
    @GetMapping("/activate")
    public void activateAccount(@RequestParam(value = "key") String key) {
        //        Optional<User> user = userService.activateRegistration(key);
        //        if (!user.isPresent()) {
        //            throw new AccountResourceException("No user was found for this activation key");
        //        }
    }

    /**
     * {@code GET  /account} : get the current user.
     *
     * @return the current user.
     * @throws RuntimeException {@code 500 (Internal Server Error)} if the user couldn't be returned.
     */
    @GetMapping("/account")
    public AdminUserDTO getAccount() {
        return userService
            .getUserWithAuthorities()
            .map(AdminUserDTO::new)
            .orElseThrow(() -> new AccountResourceException("User could not be found"));
    }

    /**
     * {@code POST  /account} : update the current user information.
     *
     * @param userDTO the current user information.
     * @throws EmailAlreadyUsedException {@code 400 (Bad Request)} if the email is already used.
     * @throws RuntimeException {@code 500 (Internal Server Error)} if the user login wasn't found.
     */
    @PostMapping("/account")
    public void saveAccount(@Valid @RequestBody AdminUserDTO userDTO) {
        String userLogin = SecurityUtils
            .getCurrentUsername()
            .orElseThrow(() -> new AccountResourceException("Current user login not found"));
        Optional<User> user = userRepository.findOneByUsername(userLogin);
        if (user.isEmpty()) {
            throw new AccountResourceException("User could not be found");
        }
        userService.updateUser(userDTO.getFullName(), userDTO.getEmail(), userDTO.getLangKey());
    }

    /**
     * {@code POST  /account/change-password} : changes the current user's password.
     *
     * @param passwordChangeDto current and new password.
     * @throws InvalidPasswordException {@code 400 (Bad Request)} if the new password is incorrect.
     */
    @PostMapping(path = "/account/change-password")
    public void changePassword(@RequestBody PasswordChangeDTO passwordChangeDto) {
        if (isPasswordLengthInvalid(passwordChangeDto.getNewPassword())) {
            throw new InvalidPasswordException();
        }
        userService.changePassword(passwordChangeDto.getCurrentPassword(), passwordChangeDto.getNewPassword());
    }

    /**
     * {@code POST   /account/reset-password/init} : Send an email to reset the password of the user.
     *
     * @param mail the mail of the user.
     * @return
     */
    @PostMapping(path = "/account/reset-password/init")
    public ResponseEntity<String> requestPasswordReset(@RequestBody String mail, HttpServletRequest httpServletRequest) {
        Optional<User> user = userService.requestPasswordReset(mail, httpServletRequest);
        if (user.isPresent()) {
            mailService.sendPasswordResetMail(user.get(), httpServletRequest);
        } else {
            // Pretend the request has been successful to prevent checking which emails really exist
            // but log that an invalid attempt has been made
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(NOT_FOUND_EMAIL);
        }
        return null;
    }

    /**
     * {@code POST   /account/reset-password/finish} : Finish to reset the password of the user.
     *
     * @param keyAndPassword the generated key and the new password.
     * @return
     * @throws InvalidPasswordException {@code 400 (Bad Request)} if the password is incorrect.
     * @throws RuntimeException         {@code 500 (Internal Server Error)} if the password could not be reset.
     */
    @PostMapping(path = "/account/reset-password/finish")
    public ResponseEntity<String> finishPasswordReset(@RequestBody KeyAndPasswordVM keyAndPassword, HttpServletRequest request) {
        String subdomain = request.getHeader("host").split("[.]")[0];
        RestaurantContext.setCurrentRestaurantById(subdomain);

        if (isPasswordLengthInvalid(keyAndPassword.getNewPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(LENGTH_INVALID);
        }
        User user = userService.completePasswordReset(keyAndPassword.getNewPassword(), keyAndPassword.getKey());

        return null;
    }

    static boolean isPasswordLengthInvalid(String password) {
        return (
            StringUtils.isEmpty(password) ||
            password.length() < ManagedUserVM.PASSWORD_MIN_LENGTH ||
            password.length() > ManagedUserVM.PASSWORD_MAX_LENGTH
        );
    }
}
