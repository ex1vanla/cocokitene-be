import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { GetAllCompanyDto } from '@dtos/company.dto'
import { CompanyService } from '@api/modules/companys/company.service'
import { PlanService } from '../plans/plan.service'
import { UserService } from '../users/user.service'
import { DetailCompanyResponse } from '../companys/company.interface'
import { UpdateCompanyDto } from '@dtos/company.dto'
import { Company } from '@entities/company.entity'
import { httpErrors } from '@shares/exception-filter'
import { SuperAdminDto } from '@dtos/user.dto'
import { User } from '@sentry/node'

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
        let existedCompany = await this.companyService.getCompanyById(companyId)
        if (!existedCompany) {
            throw new HttpException(
                httpErrors.COMPANY_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            )
        }
      

        try {
            existedCompany = await this.companyService.updateCompany(
                companyId,
                updateCompanyDto,
            )
        } catch (error) {
            throw new HttpException(
                httpErrors.COMPANY_UPDATE_FAILED,
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
        return existedCompany
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
}
