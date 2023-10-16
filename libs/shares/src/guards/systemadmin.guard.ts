import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common'
import { verifyAccessTokenJWT } from '@shares/utils/jwt'
@Injectable()
export class SystemadminGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest()
            const bearerHeader = request.headers.authorization

            if (!bearerHeader) {
                throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
            }

            const bearer = bearerHeader.split(' ')
            const token = bearer[1]

            const payload = await verifyAccessTokenJWT(token)

            if (payload) {
                request.user = payload
                return true
            }
            return false
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.UNAUTHORIZED)
        }
    }
}
