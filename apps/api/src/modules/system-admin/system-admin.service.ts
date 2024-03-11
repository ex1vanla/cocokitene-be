import {
    forwardRef,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
} from '@nestjs/common'
import {
    CreateCompanyDto,
    GetAllCompanyDto,
    GetAllCompanyStatusDto,
    UpdateCompanyDto,
} from '@dtos/company.dto'
import { CompanyService } from '@api/modules/companys/company.service'
import { UserService } from '../users/user.service'
import { DetailCompanyResponse } from '../companys/company.interface'
import { Company } from '@entities/company.entity'
import { httpErrors } from '@shares/exception-filter'
import { SuperAdminDto } from '@dtos/user.dto'
import { User } from '@sentry/node'
import { CreatePlanDto, GetAllPlanDto, UpdatePlanDto } from '@dtos/plan.dto'
import { PlanService } from '@api/modules/plans/plan.service'
import { CompanyStatusService } from '@api/modules/company-status/company-status.service'
import { RoleService } from '@api/modules/roles/role.service'
import { GetAllUserStatusDto } from '@dtos/user-status.dto'
import { UserStatusService } from '@api/modules/user-status/user-status.service'
import { SystemAdminRepository } from '@repositories/system-admin.repository'
import { Plan } from '@entities/plan.entity'
import { SystemAdmin } from '@entities/system-admin.entity'

@Injectable()
export class SystemAdminService {
    constructor(
        @Inject(forwardRef(() => CompanyService))
        private readonly companyService: CompanyService,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        private readonly planService: PlanService,
        private readonly companyStatusService: CompanyStatusService,
        private readonly roleService: RoleService,
        private readonly userStatusService: UserStatusService,
        private readonly systemAdminRepository: SystemAdminRepository,
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
        const superAdmin = await this.userService.getInternalUserById(
            superAdminCompanyId,
        )

        if (!superAdmin) {
            throw new HttpException(
                httpErrors.SUPER_ADMIN_NOT_FOUND,
                HttpStatus.BAD_REQUEST,
            )
        }

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

    async createCompany(createCompanyDto: CreateCompanyDto) {
        const company = await this.companyService.createCompany(
            createCompanyDto,
        )
        return company
    }

    async getAllUserStatus(getAllUserStatusDto: GetAllUserStatusDto) {
        const userStatus = await this.userStatusService.getAllUserStatus(
            getAllUserStatusDto,
        )
        return userStatus
    }

    async getPlanId(planId: number) {
        const plan = await this.planService.getPlanById(planId)
        return plan
    }

    async updatePlan(
        planId: number,
        updatePlanDto: UpdatePlanDto,
    ): Promise<Plan> {
        const updatePlan = await this.planService.updatePlan(
            planId,
            updatePlanDto,
        )
        return updatePlan
    }

    async createPlan(createPlanDto: CreatePlanDto) {
        const plan = await this.planService.createPlan(createPlanDto)
        return plan
    }

    async getAllSystemAdmin(): Promise<SystemAdmin[]> {
        const systemAdmins =
            await this.systemAdminRepository.getAllSystemAdmin()
        return systemAdmins
    }
}
