import { CustomRepository } from '@shares/decorators'
import { UserRole } from '@entities/user-role.entity'
import { Repository } from 'typeorm'
@CustomRepository(UserRole)
export class UserRoleRepository extends Repository<UserRole> {}
