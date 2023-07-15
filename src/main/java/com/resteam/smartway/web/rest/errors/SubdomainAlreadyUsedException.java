package com.resteam.smartway.web.rest.errors;

import com.resteam.smartway.domain.Restaurant;

public class SubdomainAlreadyUsedException extends BadRequestAlertException {

    public SubdomainAlreadyUsedException() {
        super(ErrorConstants.LOGIN_ALREADY_USED_TYPE, "subdomain name already used!", "userManagement", "restaurantExists");
    }
}
