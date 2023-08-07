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

    public static final String STAFFROLE_VIEW = "PERMISSION_STAFFROLE_VIEW";
    public static final String STAFFROLE_CREATE = "PERMISSION_STAFFROLE_CREATE";
    public static final String STAFFROLE_EDIT = "PERMISSION_STAFFROLE_EDIT";
    public static final String STAFFROLE_DELETE = "PERMISSION_STAFFROLE_DELETE";
    public static final String STAFF_VIEW = "PERMISSION_STAFF_VIEW";
    public static final String STAFF_CREATE = "PERMISSION_STAFF_CREATE";
    public static final String STAFF_EDIT = "PERMISSION_STAFF_EDIT";
    public static final String STAFF_DELETE = "PERMISSION_STAFF_DELETE";
    public static final String MENUITEM_VIEW = "PERMISSION_MENUITEM_VIEW";
    public static final String MENUITEM_CREATE = "PERMISSION_MENUITEM_CREATE";
    public static final String MENUITEM_EDIT = "PERMISSION_MENUITEM_EDIT";
    public static final String MENUITEM_DELETE = "PERMISSION_MENUITEM_DELETE";
    public static final String TABLE_VIEW = "PERMISSION_TABLE_VIEW";
    public static final String TABLE_CREATE = "PERMISSION_TABLE_CREATE";
    public static final String TABLE_EDIT = "PERMISSION_TABLE_EDIT";
    public static final String TABLE_DELETE = "PERMISSION_TABLE_DELETE";
    public static final String BILL_VIEW = "PERMISSION_BILL_VIEW";
    public static final String BILL_EDIT = "PERMISSION_BILL_EDIT";
    public static final String BILL_DELETE = "PERMISSION_BILL_DELETE";
    public static final String ORDER_WAITER = "PERMISSION_ORDER_WAITER";
    public static final String ORDER_DISCOUNT = "PERMISSION_ORDER_DISCOUNT";
    public static final String ORDER_PAYMENT = "PERMISSION_ORDER_PAYMENT";
    public static final List<String> DEFAULT_CASHIER_AUTHORITIES = List.of(
        ORDER_WAITER,
        ORDER_PAYMENT,
        ORDER_DISCOUNT,
        BILL_VIEW,
        BILL_EDIT,
        BILL_DELETE
    );
    public static final List<String> DEFAULT_MANAGER_AUTHORITIES = List.of(
        ORDER_WAITER,
        ORDER_PAYMENT,
        ORDER_DISCOUNT,
        BILL_VIEW,
        BILL_EDIT,
        BILL_DELETE,
        STAFFROLE_VIEW,
        STAFFROLE_CREATE,
        STAFFROLE_EDIT,
        STAFFROLE_DELETE,
        STAFF_VIEW,
        STAFF_CREATE,
        STAFF_EDIT,
        STAFF_DELETE,
        MENUITEM_VIEW,
        MENUITEM_CREATE,
        MENUITEM_EDIT,
        MENUITEM_DELETE,
        TABLE_VIEW,
        TABLE_CREATE,
        TABLE_EDIT,
        TABLE_DELETE
    );

    private AuthoritiesConstants() {}
}
