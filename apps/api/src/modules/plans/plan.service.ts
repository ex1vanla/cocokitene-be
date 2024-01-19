import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { GetAllPlanDto, UpdatePlanDto } from '@dtos/plan.dto'
import { Pagination } from 'nestjs-typeorm-paginate'
import { Plan } from '@entities/plan.entity'
import { PlanRepository } from '@repositories/plan.repository'
import { PlanEnum } from '@shares/constants'
import { httpErrors } from '@shares/exception-filter'

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

    async getPlanById(planId: number): Promise<Plan> {
        const plan = await this.planRepository.findOne({
            where: {
                id: planId,
            },
        })
        if (!plan) {
            throw new HttpException(
                httpErrors.PLAN_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            )
        }
        return plan
    }

    async updatePlan(
        planId: number,
        updatePlanDto: UpdatePlanDto,
    ): Promise<Plan> {
        let existedPlan = await this.getPlanById(planId)
        if (!existedPlan) {
            throw new HttpException(
                httpErrors.PLAN_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            )
        }

        try {
            existedPlan = await this.planRepository.updatePlan(
                planId,
                updatePlanDto,
            )

            return existedPlan
        } catch (error) {
            throw new HttpException(
                {
                    code: httpErrors.PLAN_UPDATE_FAILED.code,
                    message: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }
}
