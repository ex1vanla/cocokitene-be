import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { RoleMtgService } from '@api/modules/role-mtgs/role-mtg.service'

@Controller('role-mtgs')
@ApiTags('role-mtgs')
export class RoleMtgController {
    constructor(private readonly roleMtgService: RoleMtgService) {}
}
