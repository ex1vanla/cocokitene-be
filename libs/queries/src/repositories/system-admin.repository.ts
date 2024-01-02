import { Repository } from 'typeorm'
import { SystemAdmin } from '@entities/system-admin.entity'
import { CustomRepository } from '@shares/decorators'
@CustomRepository(SystemAdmin)
export class SystemAdminRepository extends Repository<SystemAdmin> {
    async findSystemAdminByEmail(email: string): Promise<SystemAdmin> {
        const systemAdmin = await this.findOne({
            where: {
                email: email,
            },
        })
        return systemAdmin
    }
    async getSystemAdminByResetPasswordToken(
        token: string,
    ): Promise<SystemAdmin> {
        const systemAdmin = await this.findOne({
            where: {
                resetPasswordToken: token,
            },
        })
        return systemAdmin
    }

    async getSystemAdminById(systemAdminId: number): Promise<SystemAdmin> {
        const systemAdmin = await this.findOne({
            where: {
                id: systemAdminId,
            },
        })
        return systemAdmin
    }
}
