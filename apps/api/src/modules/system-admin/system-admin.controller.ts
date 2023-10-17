import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common'
import { SystemAdminService } from '@api/modules/system-admin/system-admin.service'
import { CompanyService } from '@api/modules/companys/company.service'
import { GetAllCompanyDto } from '@dtos/company.dto'

@Controller('system-admin')
@ApiTags('system-admin')
export class SystemAdminController {
    constructor(
        private readonly systemAdminService: SystemAdminService,
        private readonly companyService: CompanyService,
    ) {}

    @Get('/get-all-companys')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    // @UseGuards(SystemAdminGuard)
    async getAllCompanys(@Query() getAllCompanyDto: GetAllCompanyDto) {
        const companys = await this.companyService.getAllCompanys(
            getAllCompanyDto,
        )
        return companys
    }
}
