import { Module } from '@nestjs/common'
import { AuthControler } from '@api/modules/auths/auth.controler'
import { AuthService } from '@api/modules/auths/auth.service'
import { UserModule } from '@api/modules/users/user.module'
import { UserRoleModule } from '@api/modules/user-roles/user-role.module'
import { RoleModule } from '@api/modules/roles/role.module'

@Module({
    imports: [UserModule, RoleModule, UserRoleModule],
    controllers: [AuthControler],
    providers: [AuthService],
})
export class AuthModule {}
