import { CustomRepository } from '@shares/decorators'
import { Repository } from 'typeorm'
import { ParticipantMeetingTransaction } from '@entities/participant-meeting-transaction.entity'
import { ParticipantDto } from '@dtos/user-meeting.dto'

@CustomRepository(ParticipantMeetingTransaction)
export class ParticipantMeetingTransactionRepository extends Repository<ParticipantMeetingTransaction> {
    async createParticipantMeetingTransaction(
        participantDto: ParticipantDto,
    ): Promise<ParticipantMeetingTransaction> {
        const { username, userId, status, role } = participantDto

        const createParticipantMeetingTransaction = await this.create({
            userId,
            username,
            status,
            role,
        })
        return await createParticipantMeetingTransaction.save()
    }
}
