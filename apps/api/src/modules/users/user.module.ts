import { Module } from '@nestjs/common'
import { UserService } from '@api/modules/users/user.service'
import { UserController } from '@api/modules/users/user.controller'

@Module({
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
