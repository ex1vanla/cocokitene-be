import { Plan } from '@entities/plan.entity'
import { CustomRepository } from '@shares/decorators'
import { Repository } from 'typeorm'
import { GetAllPlanDto } from '@dtos/plan.dto'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
@CustomRepository(Plan)
export class PlanRepository extends Repository<Plan> {
    async getAllPlans(options: GetAllPlanDto): Promise<Pagination<Plan>> {
        const { page, limit, searchQuery } = options
        const queryBuilder = this.createQueryBuilder('plans').select([
            'plans.id',
            'plans.planName',
            'plans.description',
            'plans.maxStorage',
            'plans.maxMeeting',
            'plans.price',
            'plans.maxShareholderAccount',
        ])
        if (searchQuery) {
            queryBuilder.andWhere('plans.planName like :planName', {
                planName: `%${searchQuery}%`,
            })
        }
        return paginate(queryBuilder, { page, limit })
    }
}
