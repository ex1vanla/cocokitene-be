import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { RolePermissionService } from '@api/modules/role-permissions/role-permission.service'
import { RoleForPermissionDto } from '@dtos/role-permission.dto'
import { Permission } from '@shares/decorators/permission.decorator'
import { PermissionEnum } from '@shares/constants'

@Controller('role-permissions')
@ApiTags('role-permissions')
export class RolePermissionController {
    constructor(
        private readonly rolePermissionService: RolePermissionService,
    ) {}

    @Patch('/company/:id')
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @Permission(PermissionEnum.SETTING_PERMISSION_FOR_ROLES)
    async updateRoleForPermission(
        @Body() roleForPermissionDto: RoleForPermissionDto,
        @Param('id') companyId: number,
    ) {
        const listIdRoleForPermission =
            await this.rolePermissionService.updateRoleForPermission(
                roleForPermissionDto,
                companyId,
            )
        return listIdRoleForPermission
    }
}
