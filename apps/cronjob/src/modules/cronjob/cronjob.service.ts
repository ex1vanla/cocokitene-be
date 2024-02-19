import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { TransactionService } from '../transactions/transaction.service'

@Injectable()
export class CronjobService {
    constructor(private readonly transactionService: TransactionService) {}
    // @Cron(CronExpression.EVERY_30_SECONDS)
    // @Cron(CronExpression.EVERY_SECOND)
    // async handleAllEndedMeeting() {
    //     await this.transactionService.handleAllEndedMeeting()
    // }

    // @Cron(CronExpression.EVERY_SECOND)
    @Cron(CronExpression.EVERY_30_SECONDS)
    async handleDataAfterEventSuccessfulCreatedMeeting() {
        await this.transactionService.handleDataAfterEventSuccessfulCreatedMeeting()
    }
}
