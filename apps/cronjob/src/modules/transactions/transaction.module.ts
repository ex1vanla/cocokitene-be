import { Module } from '@nestjs/common'
import { TransactionService } from './transaction.service'
import { TypeOrmExModule } from '@shares/modules'
import { UserMeetingRepository } from '@repositories/user-meeting.repository'
import { MeetingRepository } from '@repositories/meeting.repository'
import { ProposalRepository } from '@repositories/proposal.repository'
import { ProposalFileRepository } from '@repositories/proposal-file.repository'
import { TransactionRepository } from '@repositories/transaction.repository'
import { ParticipantMeetingTransactionRepository } from '@repositories/participant-meeting-transaction.repository'
import { ProposalTransactionRepository } from '@repositories/proposal-transaction.repository'
import { FileOfProposalTransactionRepository } from '@repositories/file-of-proposal-transaction.repository'
import { VotingTransactionRepository } from '@repositories/voting-transaction.repository'
import { VotingRepository } from '@repositories/voting.repository'
import { FileOfMeetingTransactionRepository } from '@repositories/file-of-meeting-transaction.repository'
import { MeetingFileRepository } from '@repositories/meeting-file.repository'

const Repositories = TypeOrmExModule.forCustomRepository([
    UserMeetingRepository,
    MeetingRepository,
    ProposalRepository,
    ProposalFileRepository,
    TransactionRepository,
    ParticipantMeetingTransactionRepository,
    ProposalTransactionRepository,
    FileOfProposalTransactionRepository,
    VotingTransactionRepository,
    VotingRepository,
    MeetingFileRepository,
    FileOfMeetingTransactionRepository,
])

@Module({
    imports: [Repositories],
    providers: [TransactionService],
    exports: [TransactionService],
})
export class TransactionModule {}
