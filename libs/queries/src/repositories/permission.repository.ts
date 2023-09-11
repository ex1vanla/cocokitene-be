import { CustomRepository } from '@shares/decorators';
import { Permission } from '@entities/permission.entity';
import { Repository } from 'typeorm';

@CustomRepository(Permission)
export class PermissionRepository extends Repository<Permission> {}
