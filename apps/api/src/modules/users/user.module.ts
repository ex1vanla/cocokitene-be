import { forwardRef, Module } from '@nestjs/common'
import { UserService } from '@api/modules/users/user.service'
import { UserController } from '@api/modules/users/user.controller'
import { CompanyModule } from '@api/modules/companys/company.module'
import { UserRoleModule } from '@api/modules/user-roles/user-role.module'

@Module({
    imports: [forwardRef(() => CompanyModule), UserRoleModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
