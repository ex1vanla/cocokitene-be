import { UserSeenMessage } from '@entities/seen-messages.entity'
import { CustomRepository } from '@shares/decorators'
import { Repository } from 'typeorm'

@CustomRepository(UserSeenMessage)
export class UserSeenMessageRepository extends Repository<UserSeenMessage> {
    async createUserSeenMessage(
        userId: number,
        meetingId: number,
    ): Promise<UserSeenMessage> {
        const createUserSeenMessage = await this.create({
            userId,
            meetingId,
        })
        await createUserSeenMessage.save()
        return createUserSeenMessage
    }

    async getLaseMessageUserSeenByMeetingId(
        userId: number,
        meetingId: number,
    ): Promise<UserSeenMessage> {
        const lastMessageUserSeen = await this.findOne({
            where: {
                userId: userId,
                meetingId: meetingId,
            },
        })
        if (!lastMessageUserSeen) {
            const createdLastMessageUserSeen = await this.createUserSeenMessage(
                userId,
                meetingId,
            )
            return createdLastMessageUserSeen
        }
        return lastMessageUserSeen
    }

    async updateLastMessageSeenByUser(
        userId: number,
        meetingId: number,
        lastMessageIdSeen: number,
    ): Promise<UserSeenMessage> {
        await this.createQueryBuilder('seen_messages')
            .update(UserSeenMessage)
            .set({
                lastMessageIdSeen: lastMessageIdSeen,
            })
            .where('seen_messages.user_id = :userId', { userId })
            .andWhere('seen_messages.meeting_id = :meetingId', {
                meetingId,
            })
            .execute()

        const lastMessageUserSeen = await this.findOne({
            where: {
                userId: userId,
                meetingId: meetingId,
            },
        })
        return lastMessageUserSeen
    }
}
