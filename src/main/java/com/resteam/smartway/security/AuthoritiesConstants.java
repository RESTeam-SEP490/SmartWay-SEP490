package com.resteam.smartway.security;

import java.util.List;

/**
 * Constants for Spring Security authorities.
 */
public final class AuthoritiesConstants {

    public static final String ROLE_ADMIN = "ROLE_ADMIN";

    public static final String ROLE_USER = "ROLE_USER";

    public static final String ROLE_ANONYMOUS = "ROLE_ANONYMOUS";

    public static final String ROLE_SYSTEM_ADMIN = "ROLE_SYSTEM_ADMIN";

    public static final String DASHBOARD = "PERMISSION_DASHBOARD";
    public static final String STAFFROLE = "PERMISSION_STAFFROLE";
    public static final String STAFF = "PERMISSION_STAFF";
    public static final String MENUITEM = "PERMISSION_MENUITEM";
    public static final String TABLE = "PERMISSION_TABLE";
    public static final String BILL_VIEW_ONLY = "PERMISSION_BILL_VIEWONLY";
    public static final String BILL_FULL_ACCESS = "PERMISSION_BILL_FULLACCESS";
    public static final String ORDER_ADD_AND_CANCEL = "PERMISSION_ORDER_ADD_AND_CANCEL";
    public static final String ORDER_CHECKOUT = "PERMISSION_ORDER_CHECKOUT";
    public static final String ORDER_DISCOUNT = "PERMISSION_ORDER_DISCOUNT";
    public static final String KITCHEN_PREPARING_ITEM = "PERMISSION_KITCHEN_PREPARING_ITEM";
    public static final String KITCHEN_RTS_ITEM = "PERMISSION_KITCHEN_RTS_ITEM";
    public static final List<String> DEFAULT_CASHIER_AUTHORITIES = List.of(
        ORDER_ADD_AND_CANCEL,
        ORDER_CHECKOUT,
        ORDER_DISCOUNT,
        BILL_VIEW_ONLY,
        ROLE_USER
    );
    public static final List<String> DEFAULT_MANAGER_AUTHORITIES = List.of(
        DASHBOARD,
        STAFFROLE,
        STAFF,
        MENUITEM,
        TABLE,
        ORDER_ADD_AND_CANCEL,
        ORDER_CHECKOUT,
        ORDER_DISCOUNT,
        KITCHEN_RTS_ITEM,
        KITCHEN_PREPARING_ITEM,
        BILL_FULL_ACCESS,
        ROLE_USER
    );

    private AuthoritiesConstants() {}
}
