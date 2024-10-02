import {
    ServicePlanForCompanyDto,
    UpdateCreatedServicePlanForCompanyDto,
} from '@dtos/company-service.dto'
import { CompanyServicePlan } from '@entities/company-service.entity'
import { CustomRepository } from '@shares/decorators'
import { Repository } from 'typeorm'

@CustomRepository(CompanyServicePlan)
export class CompanyServicePlanRepository extends Repository<CompanyServicePlan> {
    async getCompanyServicePlanByCompanyId(
        companyId: number,
    ): Promise<CompanyServicePlan> {
        const servicePlanCompany = await this.findOne({
            where: {
                companyId: companyId,
            },
            relations: ['plan', 'company'],
        })

        return servicePlanCompany
    }

    async createServicePlanForCompany(
        createServicePlanForCompanyDto: ServicePlanForCompanyDto,
        systemAdminId: number,
    ): Promise<CompanyServicePlan> {
        const servicePlanCreated = await this.create({
            ...createServicePlanForCompanyDto,
            meetingCreated: 0,
            accountCreated: 0,
            storageUsed: 0,
            createdSystemId: systemAdminId,
        })

        await servicePlanCreated.save()

        return servicePlanCreated
    }

    async updateServicePlanOfCompany(
        id: number,
        updateServicePlanForCompanyDto: ServicePlanForCompanyDto,
    ): Promise<CompanyServicePlan> {
        await this.createQueryBuilder('company_service')
            .update(CompanyServicePlan)
            .set({
                planId: updateServicePlanForCompanyDto.planId,
                meetingLimit: updateServicePlanForCompanyDto.meetingLimit,
                meetingCreated: 0,
                accountLimit: updateServicePlanForCompanyDto.accountLimit,
                accountCreated: 0,
                storageLimit: updateServicePlanForCompanyDto.storageLimit,
                expirationDate: updateServicePlanForCompanyDto.expirationDate,
            })
            .where('company_service.id = :id', { id: id })
            .execute()

        const servicePlanCompanyById = await this.findOne({
            where: {
                id: id,
            },
        })

        return servicePlanCompanyById
    }

    async updateCreatedOfServicePlanOfCompany(
        id: number,
        updateCreatedServicePlanForCompanyDto: UpdateCreatedServicePlanForCompanyDto,
    ): Promise<CompanyServicePlan> {
        await this.createQueryBuilder('company_service')
            .update(CompanyServicePlan)
            .set({
                meetingCreated:
                    updateCreatedServicePlanForCompanyDto.meetingCreated,
                accountCreated:
                    updateCreatedServicePlanForCompanyDto.accountCreated,
                storageUsed: updateCreatedServicePlanForCompanyDto.storageUsed,
            })
            .where('company_service.id = :id', { id: id })
            .execute()

        const servicePlanCompanyById = await this.findOne({
            where: {
                id: id,
            },
        })

        return servicePlanCompanyById
    }
}
