import { Module } from '@nestjs/common'
import { CompanyStatusController } from '@api/modules/company-status/company-status.controller'
import { CompanyStatusService } from '@api/modules/company-status/company-status.service'

@Module({
    controllers: [CompanyStatusController],
    providers: [CompanyStatusService],
    exports: [CompanyStatusService],
})
export class CompanyStatusModule {}
