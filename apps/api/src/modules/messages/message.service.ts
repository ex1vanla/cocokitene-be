import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { MessageRepository } from '@repositories/message.repository'
import { CreateMessageDto, CreateMessagePrivateDto } from '@dtos/message.dto'
import { Message } from '@entities/message.entity'
import {
    DataChatResponseDetail,
    DataMessageChat,
} from '@api/modules/messages/message.interface'

@Injectable()
export class MessageService {
    constructor(private readonly messageRepository: MessageRepository) {}

    async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
        try {
            const createdMessage = await this.messageRepository.createMessage(
                createMessageDto,
            )
            return createdMessage
        } catch (error) {
            throw new HttpException(
                { message: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    async createMessagePrivate(
        createMessagePrivateDto: CreateMessagePrivateDto,
    ): Promise<Message> {
        try {
            const createdMessagePrivate =
                await this.messageRepository.createMessagePrivate(
                    createMessagePrivateDto,
                )
            return createdMessagePrivate
        } catch (error) {
            throw new HttpException(
                { message: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    async getDataMessageByMeetingId(
        userId: number,
        meetingId: number,
    ): Promise<DataChatResponseDetail> {
        const messages = await this.messageRepository.getDataMessageByMeetingId(
            userId,
            meetingId,
        )
        const messageChat: DataMessageChat[] = await Promise.all(
            messages.map(async (item) => ({
                senderId: item.senderId,
                receiverId: item.receiverId,
                content: item.content,
                createdAt: item.createdAt,
                replyMessageId: item.replyMessageId ?? null,
            })),
        )

        return {
            rootChat: meetingId,
            messageChat: messageChat,
        }
    }
}
