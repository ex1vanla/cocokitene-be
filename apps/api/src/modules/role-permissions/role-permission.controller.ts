import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Patch,
    UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { RolePermissionService } from '@api/modules/role-permissions/role-permission.service'
import { RoleForPermissionDto } from '@dtos/role-permission.dto'
import { Permission } from '@shares/decorators/permission.decorator'
import { PermissionEnum } from '@shares/constants'
import { JwtAuthGuard } from '@shares/guards/jwt-auth.guard'
import { UserScope } from '@shares/decorators/user.decorator'
import { User } from '@entities/user.entity'

@Controller('role-permissions')
@ApiTags('role-permissions')
export class RolePermissionController {
    constructor(
        private readonly rolePermissionService: RolePermissionService,
    ) {}

    @Patch('')
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @Permission(PermissionEnum.SETTING_PERMISSION_FOR_ROLES)
    async updateRoleForPermission(
        @Body() roleForPermissionDto: RoleForPermissionDto,
        @UserScope() user: User,
    ) {
        const companyId = user?.companyId
        const listIdRoleForPermission =
            await this.rolePermissionService.updateRoleForPermission(
                roleForPermissionDto,
                companyId,
            )
        return listIdRoleForPermission
    }

    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Permission(PermissionEnum.SETTING_PERMISSION_FOR_ROLES)
    async getAllRoleWithPermissions(@UserScope() user: User) {
        const companyId = user?.companyId
        // const userId = user?.id
        const roleWithPermissions =
            await this.rolePermissionService.getAllRoleWithPermissions(
                companyId,
            )
        return roleWithPermissions
    }
}
