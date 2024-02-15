import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { TransactionService } from '../transactions/transaction.service'
import {
    ABI_BY_TYPE,
    CONTRACT_BY_CHAIN,
    CONTRACT_TYPE,
    RPC_URLS,
} from '@shares/constants'
import { ConfigCrawler } from './cronjob.interface'
import { getChainId } from '@shares/utils'
import { MeetingCrawler } from './meeting-crawler'

@Injectable()
export class CronjobService {
    constructor(
        private readonly transactionService: TransactionService,
        private readonly meetingCrawler: MeetingCrawler,
    ) {}
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
    getConfigCrawlerByContractType(type: CONTRACT_TYPE): ConfigCrawler {
        const chainId = getChainId()
        const contractArray = CONTRACT_BY_CHAIN[chainId]
        const contract = contractArray.find(
            (contract) => contract.type === type,
        )
        return {
            contract: contract.address.toLowerCase(),
            provider: RPC_URLS[chainId],
            chainId: chainId,
            abi: ABI_BY_TYPE[contract.type],
            startBlock: contract.startBlock,
            name: contract.description,
        }
    }

    // @Cron(CronExpression.EVERY_30_SECONDS)
    // @Cron(CronExpression.EVERY_SECOND)
    // async handleAllEndedMeeting() {
    //     await this.transactionService.handleAllEndedMeeting()
    // }

    @Cron(CronExpression.EVERY_SECOND)
    async handlePendingTransaction() {
        await this.transactionService.handleCheckTransaction()
    }

    // @Cron(CronExpression.EVERY_5_MINUTES)
    // async crawlMeetingEvent() {
    //     const config = await this.getConfigCrawlerByContractType(
    //         CONTRACT_TYPE.MEETING,
    //     )
    //     await this.meetingCrawler.scan(config)
    // }
}
