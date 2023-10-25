import { Company } from '@entities/company.entity'
import { Injectable } from '@nestjs/common'
import { CompanyRepository } from '@repositories/company.repository'
import { Pagination } from 'nestjs-typeorm-paginate'
import { GetAllCompanyDto, UpdateCompanyDto } from '@dtos/company.dto'
import { CompanyStatusRepository } from '@repositories/company-status.repository'

@Injectable()
export class CompanyService {
    constructor(
        private readonly companyRepository: CompanyRepository,
        private readonly companyStatusRepository: CompanyStatusRepository,
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
        const updatedCompany = await this.companyRepository.updateCompany(
            companyId,
            updateCompanyDto,
        )
        return updatedCompany
    }
}
