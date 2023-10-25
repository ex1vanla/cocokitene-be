import { Injectable } from '@nestjs/common'
import { UserRoleRepository } from '@repositories/user-role.repository'

@Injectable()
export class UserRoleService {
    constructor(private readonly userRoleRepository: UserRoleRepository) {}
    async getRoleIdsByUserId(userId: number): Promise<number[]> {
        const roleIds = await this.userRoleRepository.getRoleIdsByUserId(userId)
        return roleIds
    }

    async getRoleNameByUserId(userId: number): Promise<string[]> {
        const roleNames = await this.userRoleRepository.getRoleNameByUserId(
            userId,
        )
        return roleNames
    }
}
