import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard } from '@shares/guards/jwt-auth.guard'
import { MeetingService } from '@api/modules/meetings/meeting.service'
import { User } from '@entities/user.entity'
import { EmailService } from '@api/modules/emails/email.service'
import {
    AttendMeetingDto,
    GetAllMeetingDto,
    IdMeetingDto,
} from 'libs/queries/src/dtos/meeting.dto'
import { UserScope } from '@shares/decorators/user.decorator'
import { Permission } from '@shares/decorators/permission.decorator'

@Controller('meetings')
@ApiTags('meetings')
export class MeetingController {
    constructor(
        private readonly meetingService: MeetingService,
        private readonly emailService: EmailService,
    ) {}

    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Permission('list_meeting')
    async getAllMeetings(
        @Query() getAllMeetingDto: GetAllMeetingDto,
        @UserScope() user: User,
    ) {
        console.log('user    ', user)
        const companyId = user?.companyId
        const meetings = await this.meetingService.getAllMeetings(
            getAllMeetingDto,
            companyId,
        )
        return {
            success: true,
            content: meetings,
        }
    }

    @Post('/send-email')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    @ApiBearerAuth()
    @Permission('send_mail_to_shareholder')
    async sendEmailToShareHolder(
        @Body() idMeetingDto: IdMeetingDto,
        @UserScope() user: User,
    ) {
        await this.emailService.sendEmail(idMeetingDto, user.companyId)
        return {
            success: true,
            content: 'Emails sent successfully',
        }
    }

    @Post('/attendance-meeting')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    @ApiBearerAuth()
    @Permission('paticipate_meeting')
    async userAttendanceMeeting(
        @Body() attendMeetingDto: AttendMeetingDto,
        @UserScope() user: User,
    ) {
        const userId = user.id
        const userMeetingData = await this.meetingService.attendanceMeeting(
            attendMeetingDto,
            userId,
        )
        return {
            success: true,
            content: userMeetingData,
        }
    }
}
