import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { PermissionEnum } from '@shares/constants'
import { GetAllPermissionDto } from '@dtos/permission.dto'
import { PermissionService } from '@api/modules/permissions/permission.service'
import { Permission } from '@shares/decorators/permission.decorator'

@Controller('permissions')
@ApiTags('permissions')
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) {}
    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @Permission(PermissionEnum.LIST_PERMISSIONS)
    async getAllPermissions(@Query() getAllPermissionDto: GetAllPermissionDto) {
        const permissions = await this.permissionService.getAllPermissions(
            getAllPermissionDto,
        )
        return permissions
    }
}
