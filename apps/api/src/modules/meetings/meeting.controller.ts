import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
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
    CreateMeetingDto,
    GetAllMeetingDto,
    IdMeetingDto,
    UpdateMeetingDto,
} from 'libs/queries/src/dtos/meeting.dto'
import { UserScope } from '@shares/decorators/user.decorator'
import { Permission } from '@shares/decorators/permission.decorator'
import { PermissionEnum } from '@shares/constants/permission.const'
import { GetAllDto } from '@dtos/base.dto'

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
        // const userId = user?.id
        const meetings = await this.meetingService.getAllMeetings(
            getAllMeetingDto,
            user,
            companyId,
        )
        return meetings
    }

    @Post('/send-email')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @Permission(PermissionEnum.SEND_MAIL_TO_SHAREHOLDER)
    async sendEmailToShareHolder(
        @Body() idMeetingDto: IdMeetingDto,
        @UserScope() user: User,
    ) {
        await this.emailService.sendEmailMeeting(idMeetingDto, user.companyId)
        return 'Emails sent successfully'
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
        const companyId = user?.companyId
        const userMeetingData = await this.meetingService.attendanceMeeting(
            attendMeetingDto,
            userId,
            companyId,
        )
        return userMeetingData
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    @ApiBearerAuth()
    @Permission(PermissionEnum.CREATE_MEETING)
    async createMeeting(
        @Body() createMeetingDto: CreateMeetingDto,
        @UserScope() user: User,
    ) {
        const userId = user?.id
        const companyId = user?.companyId

        const meeting = await this.meetingService.createMeeting(
            createMeetingDto,
            userId,
            companyId,
        )
        return meeting
    }

    @Get('/:id/participants')
    @UseGuards(JwtAuthGuard)
    @Permission(PermissionEnum.DETAIL_MEETING)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    async getMeetingParticipants(
        @Param('id') meetingId: number,
        @Query() filter: GetAllDto,
        // @UserScope() user: User,
    ) {
        return this.meetingService.getAllMeetingParticipant(meetingId, filter)
    }

    @Get('/:id')
    @UseGuards(JwtAuthGuard)
    @Permission(PermissionEnum.DETAIL_MEETING)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    async getMeetingById(
        @Param('id') meetingId: number,
        @UserScope() user: User,
    ) {
        const companyId = user?.companyId
        const userId = user?.id

        const meeting = await this.meetingService.getMeetingById(
            meetingId,
            companyId,
            userId,
        )
        return meeting
    }

    @Patch('/:id')
    @UseGuards(JwtAuthGuard)
    @Permission(PermissionEnum.EDIT_MEETING)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    async updateMeeting(
        @Param('id') meetingId: number,
        @Body() updateMeetingDto: UpdateMeetingDto,
        @UserScope() user: User,
    ) {
        const userId = user?.id
        const companyId = user?.companyId
        const meeting = await this.meetingService.updateMeeting(
            meetingId,
            updateMeetingDto,
            userId,
            companyId,
        )
        return meeting
    }
}
