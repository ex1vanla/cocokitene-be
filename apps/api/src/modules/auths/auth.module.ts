import { Module } from '@nestjs/common'
import { AuthControler } from '@api/modules/auths/auth.controler'
import { AuthService } from '@api/modules/auths/auth.service'
import { UserModule } from '@api/modules/users/user.module'

@Module({
    imports: [UserModule],
    controllers: [AuthControler],
    providers: [AuthService],
})
export class AuthModule {}
