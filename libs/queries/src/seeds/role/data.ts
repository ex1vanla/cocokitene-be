import { Role } from '@entities/role.entity';
import { PartialType } from '@nestjs/mapped-types';
import { UserRole } from '@shares/constants';

export class InsertRoleDto extends PartialType(Role) {}

export const roleData: InsertRoleDto[] = [
  {
    role: UserRole.USER_ADMIN,
    description:
      'user_admin role is the major permission of the system but still smaller than user_super_admin',
  },
  {
    role: UserRole.USER_SUPER_ADMIN,
    description:
      'user_super_admin role  is the largest permission of the system',
  },
  {
    role: UserRole.USER_SHAREHOLDER,
    description: 'User_admin role is shareholder of the system ',
  },
  {
    role: UserRole.USER_NORMALLY,
    description: 'User_normally role is normal user',
  },
];
