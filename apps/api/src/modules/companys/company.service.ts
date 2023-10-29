import { Company } from '@entities/company.entity'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CompanyRepository } from '@repositories/company.repository'
import { Pagination } from 'nestjs-typeorm-paginate'
import { GetAllCompanyDto, UpdateCompanyDto } from '@dtos/company.dto'
import { CompanyStatusRepository } from '@repositories/company-status.repository'
import { httpErrors } from '@shares/exception-filter'

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
}
