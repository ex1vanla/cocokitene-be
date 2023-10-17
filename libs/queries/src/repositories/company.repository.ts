import { Company } from '@entities/company.entity'
import { CustomRepository } from '@shares/decorators'
import { Repository } from 'typeorm'
import { paginateRaw, Pagination } from 'nestjs-typeorm-paginate'
import { GetAllCompanyDto } from '@dtos/company.dto'
@CustomRepository(Company)
export class CompanyRepository extends Repository<Company> {
    async getCompanyByName(name): Promise<Company> {
        const company = await this.findOne({
            where: {
                companyName: name,
            },
        })
        return company
    }

    async getAllCompanys(
        options: GetAllCompanyDto,
    ): Promise<Pagination<Company>> {
        const { page, limit, searchQuery } = options
        const roleToCompare = 'ADMIN'
        const queryBuilder = this.createQueryBuilder('companys')
            .select(['companys.id', 'companys.companyName'])
            .leftJoin(
                'company_statuses',
                'companyStatus',
                'companyStatus.id = companys.statusId',
            )
            .leftJoin('plans', 'plan', 'plan.id = companys.planId')
            .leftJoin('users', 'user', 'companys.id = user.companyId')
            .leftJoin('user_roles', 'userRole', 'user.id = userRole.userId')
            .leftJoin('roles', 'role', 'userRole.roleId = role.id')
            .leftJoin('meetings', 'meeting', 'companys.id = meeting.companyId')
            .addSelect(`COUNT(user.id)`, 'totalCreatedAccount')
            .addSelect(`COUNT(meeting.id)`, 'totalCreatedMTGs')
            .addSelect(`plan.planName`, 'planName')
            .addSelect(`companyStatus.status`, 'companyStatus')
            .groupBy('companys.id')
        queryBuilder.addSelect((subQuery) => {
            return subQuery
                .select('MAX(user.username)')
                .from('users', 'user')
                .leftJoin('user_roles', 'userRole', 'user.id = userRole.userId')
                .leftJoin('roles', 'role', 'userRole.roleId = role.id')
                .where('role.roleName = :roleName', { roleName: roleToCompare })
                .andWhere('user.companyId = companys.id')
        }, 'adminName')
        if (searchQuery) {
            queryBuilder.andWhere('(companys.companyName like :companyName)', {
                companyName: `%${searchQuery}%`,
            })
        }

        return paginateRaw(queryBuilder, { page, limit })
    }
}
