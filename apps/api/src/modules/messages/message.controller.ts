import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { MessageService } from '@api/modules/messages/message.service'
import { JwtAuthGuard } from '@shares/guards/jwt-auth.guard'
import { Permission } from '@shares/decorators/permission.decorator'
import { PermissionEnum } from '@shares/constants'

@Controller('messages')
@ApiTags('messages')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Get('/meeting/:id')
    @UseGuards(JwtAuthGuard)
    @Permission(PermissionEnum.DETAIL_MEETING)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    async getDataMessageByMeetingId(@Param('id') meetingId: number) {
        const messages = await this.messageService.getDataMessageByMeetingId(
            meetingId,
        )
        return messages
    }
}
