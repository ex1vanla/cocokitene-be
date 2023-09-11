import { Plan } from '@entities/plan.entity';
import { PartialType } from '@nestjs/mapped-types';

export class InsertPlanDto extends PartialType(Plan) {
  planName: any;
}
export const planData: InsertPlanDto[] = [
  {
    planName: 'import products bear toys children',
    description: 'it will help children be more active',
    maxStorage: 2,
    maxMeeting: 2,
    price: 10,
    maxShareholderAccount: 3,
  },
];
