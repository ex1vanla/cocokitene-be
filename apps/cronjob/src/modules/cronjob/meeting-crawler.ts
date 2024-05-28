import { BaseCrawler } from './base-crawler'
import { BlockService } from '../block/block.service'
import { TransactionRepository } from '@repositories/transaction.repository'
import { MEETING_EVENT, TRANSACTION_STATUS } from '@shares/constants'
import { Injectable } from '@nestjs/common'
import { MeetingRepository } from '@repositories/meeting.repository'
import { ProposalRepository } from '@repositories/proposal.repository'

@Injectable()
export class MeetingCrawler extends BaseCrawler {
    constructor(
        blockService: BlockService,
        private readonly transactionRepository: TransactionRepository,
        private readonly meetingRepository: MeetingRepository,
        private readonly proposalRepository: ProposalRepository,
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
