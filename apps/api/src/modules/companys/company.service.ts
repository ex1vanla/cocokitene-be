import { Injectable } from '@nestjs/common'
import { CompanyRepository } from '@repositories/company.repository'
import { Pagination } from 'nestjs-typeorm-paginate'
import { GetAllCompanyDto } from '@dtos/company.dto'
import { Company } from '@entities/company.entity'

@Injectable()
export class CompanyService {
    constructor(private readonly companyRepository: CompanyRepository) {}

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
}
