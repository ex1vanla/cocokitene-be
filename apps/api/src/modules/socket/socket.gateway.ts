import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { CreateMessageDto } from '@dtos/message.dto'
import { MessageService } from '@api/modules/messages/message.service'

@WebSocketGateway({
    namespace: '/',
    cors: true,
    transports: ['websocket'],
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server

    constructor(private readonly messageService: MessageService) {}

    handleConnection(client: Socket) {
        // console.log('client---', client)

        console.log('Client connected:', client.id)
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected:', client.id)
    }

    @SubscribeMessage('send_chat_public')
    async handleCreateMessage(
        @MessageBody() createMessageDto: CreateMessageDto,
        @ConnectedSocket() client: Socket,
    ) {
        const createdMessage = await this.messageService.createMessage(
            createMessageDto,
        )
        client.broadcast.emit('receive_chat_public', createdMessage)
    }
}
