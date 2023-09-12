import { PartialType } from '@nestjs/mapped-types';
import { Permission } from '@entities/permission.entity';
import { PermissionEnum } from '@shares/constants/permission.const';

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
    description: 'the user with this right can see information of user detail',
  },
  {
    key: PermissionEnum.LIST_ACCOUNT,
    description: 'the user with this right can see a list users in the system',
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
    description: 'the user with this right can see a list users in the system',
  },
  {
    key: PermissionEnum.DELETE_MEETING,
    description: 'the user with this right can delete a meeting of company',
  },
  {
    key: PermissionEnum.SEND_MAIL_TO_SHAREHOLDER,
    description: 'the user with this right can send email to shareholders',
  },
];
