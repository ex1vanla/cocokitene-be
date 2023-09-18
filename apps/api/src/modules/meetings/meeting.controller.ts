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
import { Roles } from '@shares/decorators/role.decorator'
import { RolesGuard } from '@shares/guards/role.guard'
import { EmailService } from '@api/modules/emails/email.service'
import {
    AttendMeetingDto,
    GetAllMeetingDto,
    IdMeetingDto,
} from 'libs/queries/src/dtos/meeting.dto'
import { UserScope } from '@shares/decorators/user.decorator'

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
    async getAllMeetings(@Query() getAllMeetingDto: GetAllMeetingDto) {
        console.log(getAllMeetingDto)
        const meetings = await this.meetingService.getAllMeetings(
            getAllMeetingDto,
        )
        return {
            success: true,
            content: meetings,
        }
    }

    @Post('/send-email')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('USER_SUPER_ADMIN', 'USER_ADMIN')
    @HttpCode(HttpStatus.CREATED)
    @ApiBearerAuth()
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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('USER_SUPER_ADMIN', 'USER_ADMIN', 'USER_SHAREHOLDER')
    @HttpCode(HttpStatus.CREATED)
    @ApiBearerAuth()
    async userAttendanceMeeting(@Body() attendMeetingDto: AttendMeetingDto) {
        const userMeetingData = await this.meetingService.attendanceMeeting(
            attendMeetingDto,
        )
        return {
            success: true,
            content: userMeetingData,
        }
    }
}
