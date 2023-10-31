import { CreateUserRoleDto } from '@dtos/user-role.dto'
import { UserRole } from '@entities/user-role.entity'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UserRoleRepository } from '@repositories/user-role.repository'
import { httpErrors } from '@shares/exception-filter'

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
    async createUserRole(
        createUserRoleDto: CreateUserRoleDto,
    ): Promise<UserRole> {
        const { userId, roleId } = createUserRoleDto
        try {
            const createdUserRole =
                await this.userRoleRepository.createUserRole({ userId, roleId })
            return createdUserRole
        } catch (error) {
            throw new HttpException(
                {
                    code: httpErrors.USER_ROLE_CREATE_FAILED.code,
                    message: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    async updateUserRole(
        userId: number,
        newRoleIds: number[],
    ): Promise<number[]> {
        const currentRoles =
            await this.userRoleRepository.getListCurrentRoleIdOfUserId(userId)

        // ids just add from dto
        const rolesToAdds = newRoleIds.filter(
            (roleId) => !currentRoles.includes(roleId),
        )
        const addedRoles: number[] = []
        addedRoles.push(...rolesToAdds)

        //ids need to delete when it not appear in newRoleIds
        const rolesToRemoves = currentRoles.filter(
            (rolesId) => !currentRoles.includes(rolesId),
        )

        await Promise.all([
            ...rolesToRemoves.map((rolesToRemove) =>
                this.userRoleRepository.removeRole(rolesToRemove, userId),
            ),
            ...rolesToAdds.map((rolesToAdd) =>
                this.createUserRole({
                    userId: userId,
                    roleId: rolesToAdd,
                }),
            ),
        ])
        return addedRoles
    }
}
