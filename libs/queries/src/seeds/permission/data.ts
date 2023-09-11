import { PartialType } from '@nestjs/mapped-types';
import { Permission } from '@entities/permission.entity';
import { PermissionEnum } from '@shares/constants/permission.const';

export class InsertPermissionDto extends PartialType(Permission) {}
export const permissionData: InsertPermissionDto[] = [
  {
    key: PermissionEnum.MANAGE_USER,
    description:
      'the user with this right can manage and perform user-related tasks',
  },
  {
    key: PermissionEnum.MANAGE_ROLES,
    description:
      'the user with this right can manage and perform tasks related to roles and assign rights to users',
  },
  {
    key: PermissionEnum.MANAGE_SYSTEM_SETTINGS,
    description:
      'the user with this right can manage basic system settings, such as configuration specification and database management',
  },
  {
    key: PermissionEnum.MANAGE_SYSTEM_RESOURCES,
    description:
      'the user with this right can manage system resources such as servers, storage and network',
  },
  {
    key: PermissionEnum.MANAGE_DATABASE,
    description:
      'the user with this right can manage system database, including backing up, restoring and manage database data',
  },
  {
    key: PermissionEnum.ACCESS_AUDIT_LOGS,
    description:
      'the user with this right can to access and view system audit log to monitor activity and important events ',
  },
];
