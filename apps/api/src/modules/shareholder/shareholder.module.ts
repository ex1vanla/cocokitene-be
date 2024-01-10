import { forwardRef, Module } from '@nestjs/common'
import { ShareholderService } from '@api/modules/shareholder/shareholder.service'
import { ShareholderController } from '@api/modules/shareholder/shareholder.controller'
import { CompanyModule } from '@api/modules/companys/company.module'

@Module({
    imports: [forwardRef(() => CompanyModule)],
    controllers: [ShareholderController],
    providers: [ShareholderService],
    exports: [ShareholderService],
})
export class ShareholderModule {}
