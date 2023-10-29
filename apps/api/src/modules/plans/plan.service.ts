import { Injectable } from '@nestjs/common'
import { Plan } from '@entities/plan.entity'
import { PlanRepository } from '@repositories/plan.repository'

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
}
