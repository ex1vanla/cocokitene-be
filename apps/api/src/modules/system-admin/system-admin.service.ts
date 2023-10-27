import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { GetAllCompanyDto } from '@dtos/company.dto'
import { CompanyService } from '@api/modules/companys/company.service'
import { PlanService } from '../plans/plan.service'
import { UserService } from '../users/user.service'
import { DetailCompanyResponse } from '../companys/company.interface'
import { httpErrors } from '@shares/exception-filter'

@Injectable()
export class SystemAdminService {
    constructor(
        private readonly companyService: CompanyService,
        private readonly userService: UserService,
        private readonly planService: PlanService,
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
        if (!existedCompany) {
            throw new HttpException(
                httpErrors.COMPANY_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            )
        }
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
}
