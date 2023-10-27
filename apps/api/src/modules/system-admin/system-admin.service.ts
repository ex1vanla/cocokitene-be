import { Injectable } from '@nestjs/common'
import { GetAllCompanyDto } from '@dtos/company.dto'
import { CompanyService } from '@api/modules/companys/company.service'

@Injectable()
export class SystemAdminService {
    constructor(private readonly companyService: CompanyService) {}
    async getAllCompanys(getAllCompanyDto: GetAllCompanyDto) {
        const companys = await this.companyService.getAllCompanys(
            getAllCompanyDto,
        )
        return companys
    }
}
