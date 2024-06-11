import { Module } from '@nestjs/common'
import { SocketGateway } from '@api/modules/socket/socket.gateway'
import { MessageModule } from '@api/modules/messages/message.module'
import { ReactionMessageModule } from '../reaction_messages/reaction-message.module'
import { ReactionIconModule } from '../reaction-icons/reaction-icon.module'
import { MeetingModule } from '../meetings/meeting.module'

@Module({
    imports: [
        MessageModule,
        ReactionMessageModule,
        ReactionIconModule,
        MeetingModule,
    ],
    controllers: [],
    providers: [SocketGateway],
    exports: [SocketGateway],
})
export class SocketModule {}
