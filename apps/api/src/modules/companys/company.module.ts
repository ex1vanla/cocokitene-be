import { forwardRef, Module } from '@nestjs/common'
import { CompanyController } from '@api/modules/companys/company.controller'
import { CompanyService } from '@api/modules/companys/company.service'
import { UserModule } from '@api/modules/users/user.module'
import { RoleModule } from '@api/modules/roles/role.module'

@Module({
    imports: [forwardRef(() => UserModule), RoleModule],
    controllers: [CompanyController],
    providers: [CompanyService],
    exports: [CompanyService],
})
export class CompanyModule {}
