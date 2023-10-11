import { Module } from '@nestjs/common'
import { RoleService } from '@api/modules/roles/role.service'

@Module({
    providers: [RoleService],
    exports: [RoleService],
})
export class RoleModule {}
