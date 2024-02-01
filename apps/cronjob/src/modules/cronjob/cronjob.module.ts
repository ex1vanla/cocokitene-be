import { Module } from '@nestjs/common'
import { TransactionModule } from '../transactions/transaction.module'
import { TypeOrmExModule } from '@shares/modules'
import { UserMeetingRepository } from '@repositories/user-meeting.repository'
import { MeetingRepository } from '@repositories/meeting.repository'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { CronjobService } from './cronjob.service'
import { ProposalRepository } from '@repositories/proposal.repository'
import { ProposalFileRepository } from '@repositories/proposal-file.repository'
import { TransactionRepository } from '@repositories/transaction.repository'
import { ParticipantMeetingTransactionRepository } from '@repositories/participant-meeting-transaction.repository'
import { ProposalTransactionRepository } from '@repositories/proposal-transaction.repository'
import { FileOfProposalTransactionRepository } from '@repositories/file-of-proposal-transaction.repository'
const Repositories = TypeOrmExModule.forCustomRepository([
    UserMeetingRepository,
    MeetingRepository,
    ProposalRepository,
    ProposalFileRepository,
    TransactionRepository,
    ParticipantMeetingTransactionRepository,
    ProposalTransactionRepository,
    FileOfProposalTransactionRepository,
])
@Module({
    imports: [
        ConfigModule.forRoot(),
        ScheduleModule.forRoot(),
        Repositories,
        TransactionModule,
    ],
    providers: [CronjobService],
    exports: [CronjobService],
})
export class CronjobModule {}
