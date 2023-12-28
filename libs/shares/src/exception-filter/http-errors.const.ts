export const httpErrors = {
    COMMON: {
        message: 'Unknown error',
        code: 'COMMON_00000',
    },
    UNAUTHORIZED: {
        code: 'AUTH_00000',
        message: 'Unauthorized',
    },
    // user error
    INVALID_SIGNATURE: {
        message: 'Invalid signature',
        code: 'USER_00000',
    },
    USER_EXISTED: {
        message: 'User already exists. Please try again',
        code: 'USER_00001',
    },
    USER_NOT_FOUND: {
        message: 'User not found. Please try again',
        code: 'USER_00002',
    },
    USER_NOT_ACTIVE: {
        message: 'User not active. Please try again',
        code: 'USER_00003',
    },
    USER_UPDATE_FAILED: {
        message: 'User update failed. Please try again',
        code: 'USER_00006',
    },
    USER_CREATE_FAILED: {
        message: 'User create failed. Please try again',
        code: 'USER_00004',
    },

    // user status error
    USER_STATUS_NOT_EXISTED: {
        message: 'User not existed. Please try again',
        code: 'USER_STATUS_00000',
    },

    // role error
    ROLE_NOT_EXISTED: {
        message: 'Role not existed. Please try again',
        code: 'ROLE_00000',
    },
    // meeting error
    MEETING_NOT_EXISTED: {
        message: 'Meeting not existed. Please try again',
        code: 'MEETING_00000',
    },
    MEETING_CREATE_FAILED: {
        message: 'Create meeting failed. Please try again',
        code: 'MEETING_00001',
    },
    MEETING_UPDATE_FAILED: {
        message: 'Update meeting failed. Please try again',
        code: 'MEETING_00002',
    },
    MEETING_HAS_DELAYED: {
        message: 'Meeting has delayed. Please try again',
        code: 'MEETING_00003',
    },
    MEETING_NOT_START: {
        message: 'Meeting is not start. Please try again',
        code: 'MEETING_00004',
    },
    MEETING_NOT_FOUND: {
        message: 'Meeting not existed. Please try again',
        code: 'MEETING_00005',
    },
    MEETING_HAS_CANCELED: {
        message: 'Meeting has canceled. Please try again',
        code: 'MEETING_00006',
    },

    MEETING_NOT_IN_THIS_COMPANY: {
        message: ' this meeting in not of this company. Please try again',
        code: 'MEETING_00003',
    },
    // company error
    COMPANY_NOT_FOUND: {
        message: 'Company not found. Please try again',
        code: 'COMPANY_00000',
    },
    COMPANY_UPDATE_FAILED: {
        message: 'Company update failed. Please try again',
        code: 'COMPANY_00001',
    },
    COMPANY_CREATE_FAILED: {
        message: 'Company create failed. Please try again',
        code: 'COMPANY_00002',
    },
    //company-role
    COMPANY_ROLE_CREATE_FAILED: {
        message: 'Company_role create failed. Please try again',
        code: 'COMPANY_00000',
    },

    // meeting file error
    MEETING_FILE_CREATE_FAILED: {
        message: 'Create meeting file failed. Please try again',
        code: 'MEETING_FILE_00000',
    },
    MEETING_FILE_NOT_FOUND: {
        message: 'meeting file not found. Please try again',
        code: 'MEETING_FILE_00001',
    },
    // proposal error
    PROPOSAL_CREATE_FAILED: {
        message: 'Proposal create failed. Please try again',
        code: 'PROPOSAL_00000',
    },
    PROPOSAL_NOT_FOUND: {
        message: 'Proposal with meetingId and id not found. Please try again',
        code: 'PROPOSAL_000001',
    },
    PROPOSAL_VOTE_FAILED: {
        message:
            'Proposal with meetingId and type vote failed. Please try again',
        code: 'PROPOSAL_000002',
    },
    // proposal file error
    PROPOSAL_FILE_CREATE_FAILED: {
        message: 'Create proposal file failed. Please try again',
        code: 'PROPOSAL_FILE_00000',
    },

    PROPOSAL_FILES_DELETE_FAILED: {
        message: 'Delete all proposal files failed. Please try again',
        code: 'PROPOSAL_FILE_00001',
    },

    // user meeting error
    USER_MEETING_CREATE_FAILED: {
        message: 'User meeting failed. Please try again',
        code: 'USER_MEETING_00000',
    },
    USER_MEETING_NOT_FOUND: {
        message:
            'Meeting with userId and meetingId not found. Please try again',
        code: 'MEETING_00001',
    },
    //attendance
    USER_ATTENDANCE_FAILED: {
        message:
            'At now, you can not  attendance this meeting anymore because it finished. Please try again',
        code: 'USER_ATTENDANCE_00000',
    },
    USER_NOT_YET_ATTENDANCE: {
        message: 'user have not participated in the meeting,. Please try again',
        code: 'USER_ATTENDANCE_00001',
    },
    //voting
    VOTING_FAILED: {
        message:
            'At proposal, you sended  this result was duplicate with result saved in database. Please send result diffirence.',
        code: 'VOTING_00000',
    },
    VOTING_CREATED_FAILED: {
        message: 'Create voting failded. Please send result diffirence.',
        code: 'VOTING_00001',
    },
    VOTING_WHEN_MEETING_ENDED: {
        message: 'user vote when the meeting has ended. Please try again',
        code: 'VOTING_00002',
    },
    USER_NOT_HAVE_THE_RIGHT_TO_VOTE: {
        message:
            'user are not a shareholder in this meeting so you do not have the right to vote. Please try again',
        code: 'VOTING_00003',
    },
    DELETE_FAILED_USER_VOTING: {
        message: 'delete user voting failed. Please try again',
        code: 'VOTING_00004',
    },
    //system-admin
    SYSTEM_ADMIN_NOT_FOUND: {
        message: 'System admin does not exist. Please try again',
        code: 'SYSTEM_ADMIN_00000',
    },
    SYSTEM_ADMIN_INVALID_PASSWORD: {
        message:
            'Password of system admin invalid credentials. Please try again',
        code: 'SYSTEM_ADMIN_00001',
    },
    //super_admin
    SUPER_ADMIN_NOT_IN_THIS_COMPANY: {
        message: 'this super admin in not of this company. Please try again',
        code: 'SUPER_ADMIN_00000',
    },
    SUPER_ADMIN_CREATE_FAILED: {
        message: 'super admin create failed. Please try again',
        code: 'SUPER_ADMIN_00001',
    },
    SUPER_ADMIN_EXISTED: {
        message: 'super admin is existed. Please try again',
        code: 'SUPER_ADMIN_00002',
    },
    SUPER_ADMIN_NOT_FOUND: {
        message: 'super admin not found. Please try again',
        code: 'SUPER_ADMIN_00003',
    },
    // user-role
    USER_ROLE_CREATE_FAILED: {
        message: 'user_role created failed. Please try again',
        code: 'USER_ROLE_CREATE_FAILED_00000',
    },
    USER_NOT_HAS_ROLE_SHAREHOLDER: {
        message: 'user do not have the role of shareholder. Please try again',
        code: 'USER_ROLE_00001',
    },
    //role-permission
    ROLE_PERMISSION_CREATE_FAILED: {
        message: 'Create role_permission failed. Please try again',
        code: 'ROLE_PERMISSION_00000',
    },
    // profile
    USER_NOT_OWNER_OF_PROFILE: {
        message: 'User is not the owner of this profile. Please try again',
        code: 'PROFILE_00000',
    },
    PROFILE_UPDATE_FAILED: {
        message: 'Update profile failed. Please try again',
        code: 'PROFILE_00001',
    },
}
