import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common'
import { GetAllCompanyDto } from '@dtos/company.dto'
import { SystemAdminService } from '@api/modules/system-admin/system-admin.service'
import { SystemAdminGuard } from '@shares/guards/systemadmin.guard'

@Controller('system-admin')
@ApiTags('system-admin')
export class SystemAdminController {
    constructor(private readonly systemAdminService: SystemAdminService) {}

    @Get('/get-all-companys')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @UseGuards(SystemAdminGuard)
    async getAllCompanys(@Query() getAllCompanyDto: GetAllCompanyDto) {
        const companys = await this.systemAdminService.getAllCompanys(
            getAllCompanyDto,
        )
        return companys
    }
    @Get('/get-company/:id')
    @UseGuards(SystemAdminGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    async getCompanyById(@Param('id') companyId: number) {
        const company = await this.systemAdminService.getCompanyById(companyId)
        return company
    }
}
