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
        const queryBuilder = this.createQueryBuilder('companys')
            .select([
                'companys.id',
                'companys.companyName',
                'companys.representativeUser',
            ])
            .leftJoin(
                'company_statuses',
                'companyStatus',
                'companyStatus.id = companys.statusId',
            )
            .leftJoin('plans', 'plan', 'plan.id = companys.planId')
            .leftJoin('meetings', 'meeting', 'companys.id = meeting.companyId')
            .leftJoin('users', 'user', 'user.companyId = companys.id')
            .addSelect(`COUNT(DISTINCT  meeting.id)`, 'totalCreatedMTGs')
            .addSelect(`plan.planName`, 'planName')
            .addSelect(`companyStatus.status`, 'companyStatus')
            .addSelect(`COUNT(DISTINCT user.id) `, 'totalCreatedAccount')
            .groupBy('companys.id')

        if (searchQuery) {
            queryBuilder.andWhere('(companys.companyName like :companyName)', {
                companyName: `%${searchQuery}%`,
            })
        }

        return paginateRaw(queryBuilder, { page, limit })
    }
}
