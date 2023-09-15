import { PartialType } from '@nestjs/mapped-types';
import { UserRole } from '@entities/user-role.entity';

export class InsertUserRoleDto extends PartialType(UserRole) {}
export const userRoleData: InsertUserRoleDto[] = [
  {
    userId: 1,
    roleId: 4,
  },
  {
    userId: 2,
    roleId: 1,
  },
  {
    userId: 3,
    roleId: 2,
  },
  {
    userId: 4,
    roleId: 2,
  },
];
