import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common'
import { CreateCompanyDto, GetAllCompanyDto } from '@dtos/company.dto'
import { SystemAdminService } from '@api/modules/system-admin/system-admin.service'
import { GetAllCompanyStatusDto, UpdateCompanyDto } from '@dtos/company.dto'
import { SuperAdminDto } from '@dtos/user.dto'
import { GetAllPlanDto } from '@dtos/plan.dto'
import { SystemAdminGuard } from '@shares/guards/systemadmin.guard'
import { GetAllUserStatusDto } from '@dtos/user-status.dto'

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

    @Get('/company/:id')
    @UseGuards(SystemAdminGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    async getCompanyById(@Param('id') companyId: number) {
        const company = await this.systemAdminService.getCompanyById(companyId)
        return company
    }

    @Patch('/company/:id')
    @UseGuards(SystemAdminGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    async updateCompany(
        @Param('id') companyId: number,
        @Body() updateCompanyDto: UpdateCompanyDto,
    ) {
        const updatedCompany = await this.systemAdminService.updateCompany(
            companyId,
            updateCompanyDto,
        )
        return updatedCompany
    }

    @Get('/plans')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @UseGuards(SystemAdminGuard)
    async getAllPlans(@Query() getAllPlanDto: GetAllPlanDto) {
        const plans = await this.systemAdminService.getAllPlans(getAllPlanDto)
        return plans
    }

    @Get('/company-status')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @UseGuards(SystemAdminGuard)
    async getAllCompanyStatus(
        @Query() getAllCompanyStatusDto: GetAllCompanyStatusDto,
    ) {
        const companyStatus =
            await this.systemAdminService.getAllPCompanyStatus(
                getAllCompanyStatusDto,
            )
        return companyStatus
    }

    @Patch('/company/:companyId/superadmin/:id')
    @UseGuards(SystemAdminGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    async updateSuperAdmin(
        @Param('companyId') companyId: number,
        @Param('id') superAdminCompanyId: number,
        @Body() superAdminDto: SuperAdminDto,
    ) {
        const updatedSuperAdminCompany =
            await this.systemAdminService.updateSuperAdminCompany(
                companyId,
                superAdminCompanyId,
                superAdminDto,
            )
        return updatedSuperAdminCompany
    }

    @Post('/companys')
    @UseGuards(SystemAdminGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    async createCompany(@Body() createCompanyDto: CreateCompanyDto) {
        const company = await this.systemAdminService.createCompany(
            createCompanyDto,
        )
        return company
    }

    @Get('/user-status')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @UseGuards(SystemAdminGuard)
    async getAllUserStatus(
        @Query() getAllUserStatusDto: GetAllUserStatusDto,
        // @fUserScope() user: User,
    ) {
        const userStatus = await this.systemAdminService.getAllUserStatus(
            getAllUserStatusDto,
        )
        return userStatus
    }
}
