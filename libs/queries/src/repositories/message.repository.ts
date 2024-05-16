import { Repository } from 'typeorm'
import { Message } from '@entities/message.entity'
import { CustomRepository } from '@shares/decorators'
import { CreateMessageDto } from '@dtos/message.dto'

@CustomRepository(Message)
export class MessageRepository extends Repository<Message> {
    async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
        const { meetingId, senderId, replyMessageId, receiverId, content } =
            createMessageDto
        const createdMessage = await this.create({
            meetingId: meetingId,
            senderId: senderId,
            replyMessageId: replyMessageId,
            content: content,
            receiverId: receiverId,
        })
        await createdMessage.save()
        return createdMessage
    }

    async getDataMessageByMeetingId(meetingId: number): Promise<Message[]> {
        const messages = await this.find({
            where: {
                meetingId: meetingId,
            },
        })
        return messages
    }
}
