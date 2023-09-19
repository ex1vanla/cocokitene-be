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
import { PermissionEnum } from '@shares/constants/permission.const'

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
    @Permission(PermissionEnum.LIST_MEETING)
    async getAllMeetings(
        @Query() getAllMeetingDto: GetAllMeetingDto,
        @UserScope() user: User,
    ) {
        const companyId = user?.companyId
        const meetings = await this.meetingService.getAllMeetings(
            getAllMeetingDto,
            companyId,
        )
        return {
            meetings,
        }
    }

    @Post('/send-email')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    @ApiBearerAuth()
    @Permission(PermissionEnum.SEND_MAIL_TO_SHAREHOLDER)
    async sendEmailToShareHolder(
        @Body() idMeetingDto: IdMeetingDto,
        @UserScope() user: User,
    ) {
        await this.emailService.sendEmail(idMeetingDto, user.companyId)
        return {
            content: 'Emails sent successfully',
        }
    }

    @Post('/attendance-meeting')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    @ApiBearerAuth()
    @Permission(PermissionEnum.PARTICIPATE_MEETING)
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
            userMeetingData,
        }
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createMeeting(@Body() createMeetingDto: CreateMeetingDto) {
        const meeting = await this.meetingService.createMeeting(
            createMeetingDto,
        )
        return meeting
    }
}
