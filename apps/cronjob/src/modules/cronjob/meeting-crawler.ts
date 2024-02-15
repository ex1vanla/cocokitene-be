import { BaseCrawler } from './base-crawler'
import { BlockService } from '../block/block.service'
import { TransactionRepository } from '@repositories/transaction.repository'
import { TRANSACTION_STATUS } from '@shares/constants'
import { MEETING_EVENT } from '@shares/constants'

export class MeetingCrawler extends BaseCrawler {
    constructor(
        blockService: BlockService,
        private readonly transactionRepository: TransactionRepository,
    ) {
        super(blockService)
    }

    async handleEvent(event: any) {
        switch (event['event']) {
            case MEETING_EVENT.CREATE_MEETING:
                await this.onMeetingCreated(event)
                break
            default:
                break
        }
    }

    async onMeetingCreated(event: any): Promise<void> {
        const { id_meeting, numberInBlockchain } = event['returnValues']
        console.log({ id_meeting, numberInBlockchain })
        // update transaction
        await this.transactionRepository.updateTransactionByMeetingId(
            +id_meeting,
            { status: TRANSACTION_STATUS.SUCCESS },
        )
    }
}
