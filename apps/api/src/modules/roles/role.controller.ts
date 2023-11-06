import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Query,
    UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { RoleService } from '@api/modules/roles/role.service'
import { JwtAuthGuard } from '@shares/guards/jwt-auth.guard'
import { Permission } from '@shares/decorators/permission.decorator'
import { PermissionEnum } from '@shares/constants'
import { GetAllNormalRolesDto } from '@dtos/role.dto'

@Controller('roles')
@ApiTags('roles')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Permission(PermissionEnum.LIST_ROLES)
    async getAllNormalRoles(
        @Query() getAllNormalRolesDto: GetAllNormalRolesDto,
        // @UserScope() user: User,
    ) {
        const normalRoles = await this.roleService.getAllNormalRoles(
            getAllNormalRolesDto,
        )
        return normalRoles
    }
}
