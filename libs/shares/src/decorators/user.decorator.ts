import { User } from '@entities/user.entity'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const UserScope = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest()

        return request.user as User
    },
)
