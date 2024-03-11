export enum PermissionEnum {
    CREATE_ACCOUNT = 'create_account',
    EDIT_ACCOUNT = 'edit_account',
    DETAIL_ACCOUNT = 'detail_account',
    LIST_ACCOUNT = 'list_account',
    CREATE_MEETING = 'create_meeting',
    EDIT_MEETING = 'edit_meeting',
    DETAIL_MEETING = 'detail_meeting',
    SEND_MAIL_TO_SHAREHOLDER = 'send_mail_to_shareholder',
    SHAREHOLDERS_MTG = 'shareholders_mtg',
    VOTING_PROPOSAL = 'voting_proposal',
    EDIT_PROPOSAL = 'edit_proposal',
    LIST_USER_STATUS = 'list_user_status',
    LIST_ROLES_NORMAL = 'list_roles_normal',
    LIST_ROLES_INTERNAL = 'list_roles_internal',
    LIST_PERMISSIONS = 'list_permission',
    SETTING_PERMISSION_FOR_ROLES = 'setting_permission_for_roles',
    CREATE_ROLE = 'create_role',
    EDIT_PROFILE = 'edit_profile',
    DETAIL_PROFILE = 'detail_profile',
    LIST_SHAREHOLDERS = 'list_shareholders',
    DETAIL_SHAREHOLDERS = 'detail_shareholders',
    EDIT_SHAREHOLDERS = 'edit_shareholders',
}

export enum StatePermisisionForRolesEnum {
    DISABLED = 0,
    ENABLED = 1,
}
