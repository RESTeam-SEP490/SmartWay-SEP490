package com.resteam.smartway.security;

/**
 * Constants for Spring Security authorities.
 */
public final class AuthoritiesConstants {

    public static final String ROLE_ADMIN = "ROLE_ADMIN";

    public static final String ROLE_USER = "ROLE_USER";

    public static final String ROLE_ANONYMOUS = "ROLE_ANONYMOUS";

    public static final String ROLE_SYSTEM_ADMIN = "ROLE_SYSTEM_ADMIN";

    private static final String STAFFROLE_VIEW = "PERMISSION_STAFFROLE_VIEW";
    private static final String STAFFROLE_CREATE = "PERMISSION_STAFFROLE_CREATE";
    private static final String STAFFROLE_EDIT = "PERMISSION_STAFFROLE_EDIT";
    private static final String STAFFROLE_DELETE = "PERMISSION_STAFFROLE_DELETE";
    private static final String STAFF_VIEW = "PERMISSION_STAFF_VIEW";
    private static final String STAFF_CREATE = "PERMISSION_STAFF_CREATE";
    private static final String STAFF_EDIT = "PERMISSION_STAFF_EDIT";
    private static final String STAFF_DELETE = "PERMISSION_STAFF_DELETE";
    private static final String MENUITEM_VIEW = "PERMISSION_MENUITEM_VIEW";
    private static final String MENUITEM_CREATE = "PERMISSION_MENUITEM_CREATE";
    private static final String MENUITEM_EDIT = "PERMISSION_MENUITEM_EDIT";
    private static final String MENUITEM_DELETE = "PERMISSION_MENUITEM_DELETE";
    private static final String TABLE_VIEW = "PERMISSION_TABLE_VIEW";
    private static final String TABLE_CREATE = "PERMISSION_TABLE_CREATE";
    private static final String TABLE_EDIT = "PERMISSION_TABLE_EDIT";
    private static final String TABLE_DELETE = "PERMISSION_TABLE_DELETE";
    private static final String BILL_VIEW = "PERMISSION_BILL_VIEW";
    private static final String BILL_EDIT = "PERMISSION_BILL_EDIT";
    private static final String BILL_DELETE = "PERMISSION_BILL_DELETE";
    private static final String ORDER_WAITER = "PERMISSION_ORDER_WAITER";
    private static final String ORDER_DISCOUNT = "PERMISSION_ORDER_DISCOUNT";
    private static final String ORDER_PAYMENT = "PERMISSION_ORDER_PAYMENT";

    private AuthoritiesConstants() {}
}
