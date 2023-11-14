import { Injectable } from '@nestjs/common'
import { GetAllPlanDto } from '@dtos/plan.dto'
import { Pagination } from 'nestjs-typeorm-paginate'
import { Plan } from '@entities/plan.entity'
import { PlanRepository } from '@repositories/plan.repository'
import { PlanEnum } from '@shares/constants'

@Injectable()
export class PlanService {
    constructor(private readonly planRepository: PlanRepository) {}

    async getPlanCompany(planId: number): Promise<Plan> {
        const plan = await this.planRepository.findOne({
            where: {
                id: planId,
            },
        })
        return plan
    }

    async getAllPlans(getAllPlanDto: GetAllPlanDto): Promise<Pagination<Plan>> {
        const plans = await this.planRepository.getAllPlans(getAllPlanDto)
        return plans
    }

    async getPlanByPlanName(planName: PlanEnum): Promise<Plan> {
        const plan = await this.planRepository.findOne({
            where: {
                planName: planName,
            },
        })
        return plan
    }
}
