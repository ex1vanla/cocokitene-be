import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreatePlanDto, GetAllPlanDto, UpdatePlanDto } from '@dtos/plan.dto'
import { Pagination } from 'nestjs-typeorm-paginate'
import { Plan } from '@entities/plan.entity'
import { PlanRepository } from '@repositories/plan.repository'
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

    async getPlanByPlanName(planName: string): Promise<Plan> {
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

        const planExisted = await this.getPlanByPlanName(updatePlanDto.planName)
        if (planExisted && planExisted.planName !== existedPlan.planName) {
            throw new HttpException(
                httpErrors.DUPLICATE_PLAN_NAME,
                HttpStatus.BAD_REQUEST,
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

    async createPlan(createPlanDto: CreatePlanDto): Promise<Plan> {
        try {
            const createdPlan = await this.planRepository.createPlan(
                createPlanDto,
            )
            return createdPlan
        } catch (error) {
            throw new HttpException(
                httpErrors.PLAN_CREATE_FAILED,
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }
}
