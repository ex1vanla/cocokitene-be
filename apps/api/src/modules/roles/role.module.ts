import { Module } from '@nestjs/common'
import { RoleService } from '@api/modules/roles/role.service'
import { RoleController } from '@api/modules/roles/role.controller'

@Module({
    controllers: [RoleController],
    providers: [RoleService],
    exports: [RoleService],
})
export class RoleModule {}
