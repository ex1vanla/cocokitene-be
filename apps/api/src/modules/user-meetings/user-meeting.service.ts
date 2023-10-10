import { CreateUserMeetingDto } from '@dtos/user-meeting.dto'
import { UserMeeting } from '@entities/user-meeting.entity'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UserMeetingRepository } from '@repositories/user-meeting.repository'
import { httpErrors } from '@shares/exception-filter'

@Injectable()
export class UserMeetingService {
    constructor(
        private readonly userMeetingRepository: UserMeetingRepository,
    ) {}

    async createUserMeeting(
        createUserMeetingDto: CreateUserMeetingDto,
    ): Promise<UserMeeting> {
        const { userId, meetingId, role } = createUserMeetingDto
        try {
            const createdUserMeeting =
                await this.userMeetingRepository.createUserMeeting({
                    userId,
                    meetingId,
                    role,
                })
            // return await createdUserMeeting.save()
            return createdUserMeeting
        } catch (error) {
            throw new HttpException(
                {
                    code: httpErrors.USER_MEETING_CREATE_FAILED.code,
                    message: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }
}
