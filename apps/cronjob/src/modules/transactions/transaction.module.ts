import { Module } from '@nestjs/common'
import { TransactionService } from './transaction.service'
import { MeetingModule } from '@api/modules/meetings/meeting.module'

@Module({
    imports: [MeetingModule],
    providers: [TransactionService],
    exports: [TransactionService],
})
export class TransactionModule {}
