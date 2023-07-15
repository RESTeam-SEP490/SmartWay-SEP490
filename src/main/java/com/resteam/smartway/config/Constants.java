package com.resteam.smartway.config;

/**
 * Application constants.
 */
public final class Constants {

    // Regex for acceptable logins
    public static final String LOGIN_REGEX = "^(?=[a-zA-Z0-9._]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$";

    public static final String SYSTEM = "system";
    public static final String SYSTEM_RES_ID = "system@";
    public static final String DEFAULT_LANGUAGE = "en";
    public static final String RESTAURANT_FILTER_NAME = "restaurantFilter";

    private Constants() {}
}
