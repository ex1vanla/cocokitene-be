export const messageLog = {
    TURN_ON_DAPP: {
        message: '🚀 [DAPP] Api application is running on: ',
        code: 'DAPP_0000',
    },

    //Authorization SystemAdmin
    LOGIN_SYSTEM_SUCCESS: {
        message: '🚀[DAPP] System admin login successfully ,email System : ',
        code: 'AUTH_SYSTEM_0000',
    },
    LOGIN_SYSTEM_FAILED: {
        message: '🚀[DAPP] System admin login failed ,email System : ',
        code: 'AUTH_SYSTEM_0001',
    },
    RESET_PASSWORD_SYSTEM_SUCCESS: {
        message:
            '🚀[DAPP] Password of SystemAdmin reset successfully by email of SystemAdmin: ',
        code: 'AUTH_SYSTEM_0002',
    },
    RESET_PASSWORD_SYSTEM_FAILED: {
        message:
            '🚀[DAPP] Password of SystemAdmin reset failed by email of SystemAdmin: ',
        code: 'AUTH_SYSTEM_0003',
    },
    CHANGE_PASSWORD_SYSTEM_SUCCESS: {
        message:
            '🚀[DAPP] Change Password of SystemAdmin successfully, email of SystemAdmin: ',
        code: 'AUTH_SYSTEM_0004',
    },
    CHANGE_PASSWORD_SYSTEM_FAILED: {
        message:
            '🚀[DAPP] Change Password of SystemAdmin failed, email of SystemAdmin: ',
        code: 'AUTH_SYSTEM_0005',
    },

    //Authorization User
    LOGIN_WALLET_ADDRESS_SUCCESS: {
        message: '[DAPP] User login successfully by walletAddress: ',
        code: 'AUTH_0000',
    },
    LOGIN_WALLET_ADDRESS_FAILED: {
        message: '[DAPP] User failed by walletAddress: ',
        code: 'AUTH_0001',
    },
    LOGIN_EMAIL_SUCCESS: {
        message: '[DAPP] User login successfully by email: ',
        code: 'AUTH_0002',
    },
    LOGIN_EMAIL_FAILED: {
        message: '[DAPP] User login failed by email: ',
        code: 'AUTH_0003',
    },
    LOGIN_USER_INACTIVE: {
        message: '[DAPP] Inactive User login : ',
        code: 'AUTH_0003',
    },
    RESET_PASSWORD_SUCCESS: {
        message: '[DAPP] Password of user reset successfully by email: ',
        code: 'AUTH_0004',
    },
    RESET_PASSWORD_FAILED: {
        message: '[DAPP] Password of user reset failed by email: ',
        code: 'AUTH_0005',
    },
    CHANGE_PASSWORD_SUCCESS: {
        message: '[DAPP] Change Password of user successfully, email of user: ',
        code: 'AUTH_0006',
    },
    CHANGE_PASSWORD_FAILED: {
        message: '[DAPP] Change Password of user failed, email of user: ',
        code: 'AUTH_0007',
    },

    //Company
    CREATE_COMPANY_SUCCESS: {
        message: '🚀[DAPP] Create Company successfully ,ID company : ',
        code: 'COMPANY_0000',
    },
    CREATE_COMPANY_FAILED: {
        message: '🚀[DAPP] Create Company failed ',
        code: 'COMPANY_0001',
    },
    CREATE_COMPANY_FAILED_DUPLICATE: {
        message: '🚀[DAPP] Create Company failed duplicate : ',
        code: 'COMPANY_0001',
    },
    UPDATE_COMPANY_SUCCESS: {
        message: '🚀[DAPP] Update Company successfully ,ID company : ',
        code: 'COMPANY_0002',
    },
    UPDATE_COMPANY_FAILED: {
        message: '🚀[DAPP] Update Company failed ,ID company : ',
        code: 'COMPANY_0003',
    },

    //Service Plan
    CREATE_SERVICE_PLAN_SUCCESS: {
        message: '🚀[DAPP] Create Service Plan successfully ,ServicePLan ID : ',
        code: 'PLAN_0000',
    },
    CREATE_SERVICE_PLAN_FAILED: {
        message: '🚀[DAPP] Create Service Plan failed ',
        code: 'PLAN_0001',
    },
    CREATE_SERVICE_PLAN_FAILED_DUPLICATE: {
        message: '🚀[DAPP] Create Service Plan failed duplicate : ',
        code: 'PLAN_0002',
    },
    UPDATE_SERVICE_PLAN_SUCCESS: {
        message: '🚀[DAPP] Update Service Plan successfully ,ServicePlan ID : ',
        code: 'PLAN_0003',
    },
    UPDATE_SERVICE_PLAN_FAILED: {
        message: '🚀[DAPP] Update Service Plan failed ,ServicePlan ID : ',
        code: 'PLAN_0004',
    },

    //Account
    CREATE_ACCOUNT_SUCCESS: {
        message: '[DAPP] Create Account successfully ,Account ID : ',
        code: 'ACCOUNT_0000',
    },
    CREATE_ACCOUNT_FAILED: {
        message: '[DAPP] Create Account failed ',
        code: 'ACCOUNT_0001',
    },
    CREATE_ACCOUNT_FAILED_DUPLICATE: {
        message: '[DAPP] Create Account failed duplicate : ',
        code: 'ACCOUNT_0002',
    },
    UPDATE_ACCOUNT_SUCCESS: {
        message: '[DAPP] Update Account successfully ,Account ID : ',
        code: 'ACCOUNT_0003',
    },
    UPDATE_ACCOUNT_FAILED: {
        message: '[DAPP] Update Account failed ,Account ID : ',
        code: 'ACCOUNT_0004',
    },
    //Profile
    UPDATE_PROFILE_SUCCESS: {
        message: '[DAPP] Update Account successfully ,Account ID : ',
        code: 'PROFILE_0000',
    },
    UPDATE_PROFILE_FAILED: {
        message: '[DAPP] Update Profile failed ,Account ID : ',
        code: 'PROFILE_0001',
    },

    //Shareholder Meeting
    CREATE_SHAREHOLDER_MEETING_SUCCESS: {
        message:
            '[DAPP] Create Shareholder Meeting successfully ,Shareholder Meeting ID : ',
        code: 'SHAREHOLDER_MEETING_0000',
    },
    CREATE_SHAREHOLDER_MEETING_FAILED: {
        message: '[DAPP] Create Shareholder Meeting failed ',
        code: 'SHAREHOLDER_MEETING_0001',
    },
    UPDATE_SHAREHOLDER_MEETING_SUCCESS: {
        message:
            '[DAPP] Update Shareholder Meeting successfully ,Shareholder Meeting ID : ',
        code: 'SHAREHOLDER_MEETING_0002',
    },
    UPDATE_SHAREHOLDER_MEETING_FAILED: {
        message:
            '[DAPP] Update Shareholder Meeting failed ,Shareholder Meeting ID : ',
        code: 'SHAREHOLDER_MEETING_0003',
    },

    //Voting Proposal Shareholder Meeting
    VOTING_PROPOSAL_SHAREHOLDER_MEETING_SUCCESS: {
        message: ' voting successfully for proposalId: ',
        code: 'VOTING_SHAREHOLDER_MEETING_0000',
    },
    VOTING_PROPOSAL_SHAREHOLDER_MEETING_FAILED: {
        message: ' voting failed for proposalId: ',
        code: 'VOTING_SHAREHOLDER_MEETING_0001',
    },

    //Role
    CREATE_ROLE_SUCCESS: {
        message: '[DAPP] Create role successfully ,Role name : ',
        code: 'ROLE_0000',
    },
    CREATE_ROLE_FAILED: {
        message: '[DAPP] Create role failed ,Role name : ',
        code: 'ROLE_0001',
    },
    UPDATE_ROLE_SUCCESS: {
        message: '[DAPP] Update role successfully ',
        code: 'ROLE_0002',
    },
    UPDATE_ROLE_FAILED: {
        message: '[DAPP] Update role failed ',
        code: 'ROLE_0003',
    },
}
