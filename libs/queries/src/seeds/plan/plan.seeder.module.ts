import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@shares/modules';
import { PlanRepository } from '../../repositories/plan.repository';
import { PlanSeederService } from './plan.seeder.service';

const repositories = TypeOrmExModule.forCustomRepository([PlanRepository]);

@Module({
  imports: [repositories],
  providers: [PlanSeederService],
  exports: [PlanSeederService],
})
export class PlanSeederModule {}
