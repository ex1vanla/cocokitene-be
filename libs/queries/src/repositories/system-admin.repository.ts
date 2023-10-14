import { Repository } from 'typeorm'
import { SystemAdmin } from '@entities/system-admin.entity'
import { CustomRepository } from '@shares/decorators'
@CustomRepository(SystemAdmin)
export class SystemAdminRepository extends Repository<SystemAdmin> {}
