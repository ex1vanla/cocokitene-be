import { CreateUserMeetingDto } from '@dtos/user-meeting.dto'
import { UserMeeting } from '@entities/user-meeting.entity'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UserMeetingRepository } from '@repositories/user-meeting.repository'
import { MeetingRole } from '@shares/constants/meeting.const'
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

    async getUserMeetingByMeetingIdAndRole(
        meetingId: number,
        role: MeetingRole,
    ): Promise<UserMeeting[]> {
        const userMeetings =
            await this.userMeetingRepository.getUserMeetingByMeetingIdAndRole(
                meetingId,
                role,
            )

        return userMeetings
    }
    async updateUserMeeting(
        meetingId: number,
        meetingRole: MeetingRole,
        newIdPaticipants: number[],
    ): Promise<number[]> {
        const currentRoles =
            await this.userMeetingRepository.getListUserIdPaticipantsByMeetingId(
                meetingId,
                meetingRole,
            )

        // ids just add from dto
        const usersToAdds = newIdPaticipants.filter(
            (userId) => !currentRoles.includes(userId),
        )
        const addedUsersFollowRole: number[] = []

        //ids need to delete when it not appear in newIdPaticipant
        const usersToRemoves = currentRoles.filter(
            (userId) => !newIdPaticipants.includes(userId),
        )
        for (const userId of usersToRemoves) {
            await this.userMeetingRepository.removeUserFromMeeting(
                userId,
                meetingId,
                meetingRole,
            )
        }
        for (const userId of usersToAdds) {
            await this.createUserMeeting({
                userId,
                meetingId,
                role: meetingRole,
            })
            addedUsersFollowRole.push(userId)
        }

        return addedUsersFollowRole
    }
}
