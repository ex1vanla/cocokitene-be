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
                'companys.companySize',
            ])
            .leftJoin('companys.representative', 'representative')
            .addSelect(['representative.username'])
            .leftJoin(
                'company_statuses',
                'companyStatus',
                'companyStatus.id = companys.statusId',
            )
            .leftJoin('plans', 'plan', 'plan.id = companys.planId')
            .leftJoin('meetings', 'meeting', 'companys.id = meeting.companyId')
            .addSelect(`COUNT(DISTINCT  meeting.id)`, 'totalCreatedMTGs')
            .addSelect(`plan.planName`, 'planName')
            .addSelect(`companyStatus.status`, 'companyStatus')
            .groupBy('companys.id')

        if (searchQuery) {
            queryBuilder.andWhere('(companys.companyName like :companyName)', {
                companyName: `%${searchQuery}%`,
            })
        }

        return paginateRaw(queryBuilder, { page, limit })
    }
}
