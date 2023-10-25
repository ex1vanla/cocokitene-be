import { Plan } from '@entities/plan.entity'
import { PartialType } from '@nestjs/mapped-types'

export class InsertPlanDto extends PartialType(Plan) {
    planName: any
}
export const planData: InsertPlanDto[] = [
    {
        planName: 'free',
        description: 'it will help children be more active',
        maxStorage: 2,
        maxMeeting: 2,
        price: 0,
        maxShareholderAccount: 3,
    },
    {
        planName: 'trial',
        description: 'it will help children be more active',
        maxStorage: 4,
        maxMeeting: 4,
        price: 15,
        maxShareholderAccount: 10,
    },
    {
        planName: 'pay_of_month',
        description: 'it will help children be more active',
        maxStorage: 10,
        maxMeeting: 10,
        price: 100,
        maxShareholderAccount: 30,
    },
]
