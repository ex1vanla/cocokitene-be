import { Company } from '@entities/company.entity'
import {
    forwardRef,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
} from '@nestjs/common'
import { CompanyRepository } from '@repositories/company.repository'
import { Pagination } from 'nestjs-typeorm-paginate'
import {
    CreateCompanyDto,
    GetAllCompanyDto,
    UpdateCompanyDto,
} from '@dtos/company.dto'
import { CompanyStatusRepository } from '@repositories/company-status.repository'
import { httpErrors } from '@shares/exception-filter'
import { UserService } from '@api/modules/users/user.service'
import { RoleService } from '@api/modules/roles/role.service'
import { enumToArray } from '@shares/utils/enum'
import { RoleEnum } from '@shares/constants'
import { UserRoleService } from '@api/modules/user-roles/user-role.service'
import { UserStatusService } from '@api/modules/user-status/user-status.service'
import { PlanService } from '@api/modules/plans/plan.service'
import { User } from '@entities/user.entity'
import { PermissionService } from '@api/modules/permissions/permission.service'
import { RolePermissionService } from '@api/modules/role-permissions/role-permission.service'

@Injectable()
export class CompanyService {
    constructor(
        private readonly companyRepository: CompanyRepository,
        private readonly companyStatusRepository: CompanyStatusRepository,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        private readonly roleService: RoleService,
        private readonly userRoleService: UserRoleService,
        private readonly userStatusService: UserStatusService,
        private readonly planService: PlanService,
        private readonly permissionService: PermissionService,
        private readonly rolePermissionService: RolePermissionService,
    ) {}
    async getAllCompanys(
        getAllCompanyDto: GetAllCompanyDto,
    ): Promise<Pagination<Company>> {
        const companys = await this.companyRepository.getAllCompanys(
            getAllCompanyDto,
        )
        return companys
    }

    async getCompanyById(companyId: number): Promise<Company> {
        const company = await this.companyRepository.findOne({
            where: {
                id: companyId,
            },
            relations: ['companyStatus'],
        })
        return company
    }

    async updateCompany(
        companyId: number,
        updateCompanyDto: UpdateCompanyDto,
    ): Promise<Company> {
        let existedCompany = await this.getCompanyById(companyId)
        if (!existedCompany) {
            throw new HttpException(
                httpErrors.COMPANY_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            )
        }

        try {
            existedCompany = await this.companyRepository.updateCompany(
                companyId,
                updateCompanyDto,
            )
        } catch (error) {
            throw new HttpException(
                {
                    code: httpErrors.COMPANY_UPDATE_FAILED.code,
                    message: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
        return existedCompany
    }

    async createCompany(createCompanyDto: CreateCompanyDto): Promise<Company> {
        // check email and wallet address existed super admin
        const superAdminEmail = createCompanyDto.superAdminCompany.email
        const superAdminWalletAddress =
            createCompanyDto.superAdminCompany.walletAddress

        let superAdmin: User
        superAdmin = await this.userService.getUserByEmail(superAdminEmail)
        if (superAdmin) {
            throw new HttpException(
                httpErrors.SUPER_ADMIN_EXISTED,
                HttpStatus.BAD_REQUEST,
            )
        }

        superAdmin = await this.userService.getUserByWalletAddress(
            superAdminWalletAddress,
        )
        if (superAdmin) {
            throw new HttpException(
                httpErrors.SUPER_ADMIN_EXISTED,
                HttpStatus.BAD_REQUEST,
            )
        }

        //create company
        let createdCompany: Company
        try {
            createdCompany = await this.companyRepository.createCompany(
                createCompanyDto,
            )
        } catch (error) {
            throw new HttpException(
                httpErrors.COMPANY_CREATE_FAILED,
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
        const { superAdminCompany } = createCompanyDto

        const createdSuperAdminCompany =
            await this.userService.createSuperAdminCompany({
                username: superAdminCompany.username,
                email: superAdminCompany.email,
                walletAddress: superAdminCompany.walletAddress,
                statusId: superAdminCompany.statusId,
                companyId: createdCompany.id,
            })

        await Promise.all(
            enumToArray(RoleEnum).map((role) =>
                this.roleService.createCompanyRole(role, createdCompany.id),
            ),
        )

        const roleSuperAdminOfCompany =
            await this.roleService.getRoleByRoleNameAndIdCompany(
                RoleEnum.SUPER_ADMIN,
                createdCompany.id,
            )
        const listPermissions = await this.permissionService.getAllPermissions()
        await Promise.all([
            ...listPermissions.map((permission) =>
                this.rolePermissionService.createRolePermission({
                    permissionId: permission.id,
                    roleId: roleSuperAdminOfCompany.id,
                }),
            ),
        ])

        await this.userRoleService.createUserRole({
            userId: createdSuperAdminCompany.id,
            roleId: roleSuperAdminOfCompany.id,
        })

        return createdCompany
    }
}
