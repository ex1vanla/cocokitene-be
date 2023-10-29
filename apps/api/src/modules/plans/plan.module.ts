import { Module } from '@nestjs/common'
import { PlanController } from '@api/modules/plans/plan.controller'
import { PlanService } from '@api/modules/plans/plan.service'

@Module({
    controllers: [PlanController],
    providers: [PlanService],
    exports: [PlanService],
})
export class PlanModule {}
