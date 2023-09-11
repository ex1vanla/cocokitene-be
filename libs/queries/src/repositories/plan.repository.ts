import { Plan } from '@entities/plan.entity';
import { CustomRepository } from '@shares/decorators';
import { Repository } from 'typeorm';
@CustomRepository(Plan)
export class PlanRepository extends Repository<Plan> {}
