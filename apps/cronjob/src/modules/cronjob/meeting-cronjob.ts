import { Command, Console } from 'nestjs-console'
import { timeOut } from '@shares/utils'
import { SLEEP_TIME_CRON_TRANSACTION_IN_MINI_SECONDS } from './cronjob.const'
import { TransactionService } from '../transactions/transaction.service'

@Console()
export class MeetingCronjob {
    constructor(private readonly transactionService: TransactionService) {}
    @Command({
        command: 'cron-meeting-ended',
        description: 'cron job query all ended meeting',
    })
    async handleAllEndedMeeting() {
        await timeOut(async () => {
            try {
                await this.transactionService.handleAllEndedMeeting()
            } catch (error) {
                throw new Error(error)
            }
        }, SLEEP_TIME_CRON_TRANSACTION_IN_MINI_SECONDS)
    }
}
