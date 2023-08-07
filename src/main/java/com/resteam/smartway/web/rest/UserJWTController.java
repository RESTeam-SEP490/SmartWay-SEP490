package com.resteam.smartway.web.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.resteam.smartway.config.ApplicationProperties;
import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.repository.RestaurantRepository;
import com.resteam.smartway.security.SecurityUtils;
import com.resteam.smartway.security.jwt.JWTFilter;
import com.resteam.smartway.security.jwt.TokenProvider;
import com.resteam.smartway.security.multitenancy.context.RestaurantContext;
import com.resteam.smartway.web.rest.errors.RestaurantInfoNotFoundException;
import com.resteam.smartway.web.rest.vm.LoginVM;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class UserJWTController {

    private final TokenProvider tokenProvider;

    private final AuthenticationManagerBuilder authenticationManagerBuilder;

    private final ApplicationProperties applicationProperties;

    private final RestaurantRepository restaurantRepository;

    @PostMapping("/authenticate")
    public ResponseEntity<JWTToken> authorize(@Valid @RequestBody LoginVM loginVM, HttpServletRequest request) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
            loginVM.getUsername(),
            loginVM.getPassword()
        );
        String currentResId = SecurityUtils
            .getRestaurantFromHeader(request, applicationProperties)
            .orElseThrow(RestaurantInfoNotFoundException::new);
        RestaurantContext.setCurrentRestaurantById(currentResId);
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.createToken(authentication, loginVM.isRememberMe());
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(JWTFilter.AUTHORIZATION_HEADER, "Bearer " + jwt);
        return new ResponseEntity<>(new JWTToken(jwt), httpHeaders, HttpStatus.OK);
    }

    static class JWTToken {

        private String idToken;

        JWTToken(String idToken) {
            this.idToken = idToken;
        }

        @JsonProperty("id_token")
        String getIdToken() {
            return idToken;
        }

        void setIdToken(String idToken) {
            this.idToken = idToken;
        }
    }
}
