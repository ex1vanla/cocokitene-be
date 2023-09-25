export const httpErrors = {
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
        code: 'Meeting_00000',
    },
    USER_MEETING_NOT_FOUND: {
        message:
            'Meeting with userId and meetingId not found. Please try again',
        code: 'Meeting_00001',
    },
}
