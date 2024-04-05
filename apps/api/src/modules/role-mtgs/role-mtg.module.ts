import { Module } from '@nestjs/common'
import { RoleMtgController } from '@api/modules/role-mtgs/role-mtg.controller'
import { RoleMtgService } from '@api/modules/role-mtgs/role-mtg.service'

@Module({
    imports: [],
    controllers: [RoleMtgController],
    providers: [RoleMtgService],
    exports: [RoleMtgService],
})
export class RoleMtgModule {}
