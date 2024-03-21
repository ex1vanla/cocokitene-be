import { forwardRef, Module } from '@nestjs/common'
import { UserService } from '@api/modules/users/user.service'
import { UserController } from '@api/modules/users/user.controller'
import { CompanyModule } from '@api/modules/companys/company.module'
import { UserRoleModule } from '@api/modules/user-roles/user-role.module'
import { EmailModule } from '@api/modules/emails/email.module'
import { MyLoggerModule } from '@api/modules/loggers/logger.module'

@Module({
    imports: [
        forwardRef(() => CompanyModule),
        UserRoleModule,
        EmailModule,
        MyLoggerModule,
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
