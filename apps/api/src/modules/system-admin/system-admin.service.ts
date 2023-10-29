import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { GetAllCompanyDto } from '@dtos/company.dto'
import { CompanyService } from '@api/modules/companys/company.service'
import { UserService } from '../users/user.service'
import { DetailCompanyResponse } from '../companys/company.interface'
import { GetAllCompanyStatusDto, UpdateCompanyDto } from '@dtos/company.dto'
import { Company } from '@entities/company.entity'
import { httpErrors } from '@shares/exception-filter'
import { SuperAdminDto } from '@dtos/user.dto'
import { User } from '@sentry/node'
import { GetAllPlanDto } from '@dtos/plan.dto'
import { PlanService } from '@api/modules/plans/plan.service'
import { CompanyStatusService } from '@api/modules/company-status/company-status.service'

@Injectable()
export class SystemAdminService {
    constructor(
        private readonly companyService: CompanyService,
        private readonly userService: UserService,
        private readonly planService: PlanService,
        private readonly companyStatusService: CompanyStatusService,
    ) {}

    async getAllCompanys(getAllCompanyDto: GetAllCompanyDto) {
        const companys = await this.companyService.getAllCompanys(
            getAllCompanyDto,
        )
        return companys
    }

    async getCompanyById(companyId: number): Promise<DetailCompanyResponse> {
        const existedCompany = await this.companyService.getCompanyById(
            companyId,
        )

        const [superAdmin, plan] = await Promise.all([
            this.userService.getSuperAdminCompany(existedCompany.id),
            this.planService.getPlanCompany(existedCompany.planId),
        ])

        return {
            ...existedCompany,
            superAdminInfo: superAdmin,
            servicePlan: plan,
        }
    }

    async updateCompany(
        companyId: number,
        updateCompanyDto: UpdateCompanyDto,
    ): Promise<Company> {
        const updatedCompany = await this.companyService.updateCompany(
            companyId,
            updateCompanyDto,
        )
        return updatedCompany
    }

    async updateSuperAdminCompany(
        companyId: number,
        superAdminCompanyId: number,
        superAdminDto: SuperAdminDto,
    ): Promise<User> {
        const superAdmin = await this.userService.getActiveUserById(
            superAdminCompanyId,
        )
        if (superAdmin.companyId !== companyId) {
            throw new HttpException(
                httpErrors.SUPER_ADMIN_NOT_IN_THIS_COMPANY,
                HttpStatus.BAD_REQUEST,
            )
        }
        const updatedSuperAdminCompany =
            await this.userService.updateSuperAdminCompany(
                companyId,
                superAdminCompanyId,
                superAdminDto,
            )
        return updatedSuperAdminCompany
    }

    async getAllPlans(getAllPlanDto: GetAllPlanDto) {
        const plans = await this.planService.getAllPlans(getAllPlanDto)
        return plans
    }

    async getAllPCompanyStatus(getAllCompanyStatusDto: GetAllCompanyStatusDto) {
        const companyStatuses =
            await this.companyStatusService.getAllCompanyStatus(
                getAllCompanyStatusDto,
            )
        return companyStatuses
    }
}
