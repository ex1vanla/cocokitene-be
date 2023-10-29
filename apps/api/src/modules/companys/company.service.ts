import { Injectable } from '@nestjs/common'
import { CompanyRepository } from '@repositories/company.repository'
import { Pagination } from 'nestjs-typeorm-paginate'
import { Company } from '@entities/company.entity'
import { GetAllCompanyDto } from '@dtos/company.dto'

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
}
