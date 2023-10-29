import { Module } from '@nestjs/common'
import { SystemAdminController } from '@api/modules/system-admin/system-admin.controller'
import { SystemAdminService } from '@api/modules/system-admin/system-admin.service'
import { CompanyModule } from '@api/modules/companys/company.module'

@Module({
    imports: [CompanyModule],
    controllers: [SystemAdminController],
    providers: [SystemAdminService],
})
export class SystemAdminModule {}
