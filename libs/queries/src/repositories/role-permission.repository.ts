import { CustomRepository } from '@shares/decorators';
import { RolePermission } from '@entities/role-permission.entity';
import { Repository } from 'typeorm';
@CustomRepository(RolePermission)
export class RolePermissionRepository extends Repository<RolePermission> {}
