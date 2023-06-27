package com.resteam.smartway.web.rest.errors;

import org.springframework.security.access.AccessDeniedException;

public class RestaurantInfoNotFoundException extends AccessDeniedException {

    public RestaurantInfoNotFoundException() {
        super("Restaurant info not found.");
    }
}
