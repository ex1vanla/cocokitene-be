import { CompanyStatus } from '@entities/company-status.entity';
import { CompanyStatusEnum } from '@shares/constants/company.const';
import { CustomRepository } from '@shares/decorators';
import { Repository } from 'typeorm';

@CustomRepository(CompanyStatus)
export class CompanyStatusRepository extends Repository<CompanyStatus> {
  async getCompanyStatusByStatusType(
    statusType: CompanyStatusEnum,
  ): Promise<CompanyStatus> {
    const companyStatus = await this.findOne({
      where: {
        status: statusType,
      },
    });
    return companyStatus;
  }
}
