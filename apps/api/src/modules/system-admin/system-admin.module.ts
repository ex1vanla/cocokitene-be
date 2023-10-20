import { Module } from '@nestjs/common'
import { SystemAdminController } from '@api/modules/system-admin/system-admin.controller'
import { SystemAdminService } from '@api/modules/system-admin/system-admin.service'
import { CompanyModule } from '@api/modules/companys/company.module'
import { UserModule } from '@api/modules/users/user.module'
import { PlanModule } from '@api/modules/plans/plan.module'

@Module({
    imports: [CompanyModule, UserModule, PlanModule],
    controllers: [SystemAdminController],
    providers: [SystemAdminService],
    exports: [SystemAdminService],
})
export class SystemAdminModule {}
