import { GetAllShareholderDto } from '@dtos/shareholder.dto'

import { User } from '@entities/user.entity'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { ShareholderRepository } from '@repositories/shareholder.repository'
import { Pagination } from 'nestjs-typeorm-paginate'

import { CompanyService } from '@api/modules/companys/company.service'

@Injectable()
export class ShareholderService {
    constructor(
        private readonly shareholderRepository: ShareholderRepository,
        @Inject(forwardRef(() => CompanyService))
        private readonly companyService: CompanyService,
    ) {}

    async getAllShareholderCompany(
        getAllShareholdersDto: GetAllShareholderDto,
        companyId: number,
    ): Promise<Pagination<User>> {
        const users = await this.shareholderRepository.getAllShareholderCompany(
            getAllShareholdersDto,
            companyId,
        )

        return users
    }
}
