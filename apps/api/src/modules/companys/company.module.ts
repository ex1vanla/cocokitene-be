import { Module } from '@nestjs/common'
import { CompanyController } from '@api/modules/companys/company.controller'
import { CompanyService } from '@api/modules/companys/company.service'

@Module({
    controllers: [CompanyController],
    providers: [CompanyService],
    exports: [CompanyService],
})
export class CompanyModule {}
