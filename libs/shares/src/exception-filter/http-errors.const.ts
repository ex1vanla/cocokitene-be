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
    MEETING_HAS_CANCELED: {
        message: 'Meeting has canceled. Please try again',
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
    MEETING_UPDATE_FAILED: {
        message: 'Update meeting failed. Please try again',
        code: 'MEETING_00006',
    },
    MEETING_NOT_FOUND: {
        message: 'Meeting not existed. Please try again',
        code: 'MEETING_00005',
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
    // meeting file error
    MEETING_FILE_CREATE_FAILED: {
        message: 'Create meeting file failed. Please try again',
        code: 'MEETING_FILE_00000',
    },
    // proposal error
    PROPOSAL_CREATE_FAILED: {
        message: 'Proposal file failed. Please try again',
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
}
