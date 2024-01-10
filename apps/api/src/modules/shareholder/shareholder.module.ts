import { forwardRef, Module } from '@nestjs/common'
import { ShareholderService } from '@api/modules/shareholder/shareholder.service'
import { ShareholderController } from '@api/modules/shareholder/shareholder.controller'
import { CompanyModule } from '@api/modules/companys/company.module'
import { UserRoleModule } from '@api/modules/user-roles/user-role.module'
@Module({
    imports: [forwardRef(() => CompanyModule), UserRoleModule],
    controllers: [ShareholderController],
    providers: [ShareholderService],
    exports: [ShareholderService],
})
export class ShareholderModule {}
