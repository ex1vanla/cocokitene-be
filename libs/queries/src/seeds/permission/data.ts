import { PartialType } from '@nestjs/mapped-types'
import { Permission } from '@entities/permission.entity'
import { PermissionEnum } from '@shares/constants/permission.const'

export class InsertPermissionDto extends PartialType(Permission) {}
export const permissionData: InsertPermissionDto[] = [
    {
        key: PermissionEnum.CREATE_ACCOUNT,
        description: 'the user with this right can create account',
    },
    {
        key: PermissionEnum.EDIT_ACCOUNT,
        description:
            "the user with this right can edit the user's account information",
    },
    {
        key: PermissionEnum.DETAIL_ACCOUNT,
        description:
            'the user with this right can see information of user detail',
    },
    {
        key: PermissionEnum.LIST_ACCOUNT,
        description:
            'the user with this right can see a list users in the system',
    },
    {
        key: PermissionEnum.CREATE_MEETING,
        description:
            'the user with this right can create a meeting for the company',
    },
    {
        key: PermissionEnum.EDIT_MEETING,
        description:
            "the user with this right can edit information of company's meeting",
    },
    {
        key: PermissionEnum.DETAIL_MEETING,
        description:
            'the user with this right can see information of meeting detail',
    },
    {
        key: PermissionEnum.LIST_MEETING,
        description:
            'the user with this right can see a list users in the system',
    },
    {
        key: PermissionEnum.DELETE_MEETING,
        description: 'the user with this right can delete a meeting of company',
    },
    {
        key: PermissionEnum.SEND_MAIL_TO_SHAREHOLDER,
        description: 'the user with this right can send email to shareholders',
    },
    {
        key: PermissionEnum.PARTICIPATE_MEETING,
        description:
            'the user with this right can participate in the meeting of company',
    },
    {
        key: PermissionEnum.VOTING_PROPOSAL,
        description:
            'the user with this right can vote proposal in the meeting of company',
    },
    {
        key: PermissionEnum.EDIT_PROPOSAL,
        description:
            'the user with this right can edit proposal in the meeting of company',
    },
    {
        key: PermissionEnum.DELETE_PROPOSAL,
        description:
            'the user with this right can delete proposal in the meeting of company',
    },
    {
        key: PermissionEnum.LIST_PROPOSAL,
        description:
            'the user with this right can see list proposal in the meeting of company',
    },
    {
        key: PermissionEnum.LIST_USER_STATUS,
        description:
            'the user with this right can see list status of user in the system',
    },
    {
        key: PermissionEnum.LIST_ROLES,
        description:
            'the user with this right can see list role of user in the system',
    },
    {
        key: PermissionEnum.LIST_PERMISSIONS,
        description:
            'the user with this right can see list permission of user in the system',
    },
    {
        key: PermissionEnum.SETTING_PERMISSION_FOR_ROLES,
        description:
            'the user with this right can set up list permission for each role in the company',
    },
    {
        key: PermissionEnum.CREATE_ROLE,
        description:
            'the user with this right can create role of user in the system',
    },
    {
        key: PermissionEnum.EDIT_PROFILE,
        description: 'the user with this right can update their own profile',
    },
    {
        key: PermissionEnum.DETAIL_PROFILE,
        description: 'the user with this right can see detail profile',
    },
]
