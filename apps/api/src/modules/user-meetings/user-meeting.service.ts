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
        const listUserIds = await this.getListUserIdPaticipantsByMeetingId(
            meetingId,
            meetingRole,
        )

        // ids just add from dto
        const usersToAdds = newIdPaticipants.filter(
            (userId) => !listUserIds.includes(userId),
        )
        const addedUsersFollowRole: number[] = []
        addedUsersFollowRole.push(...usersToAdds)

        //ids need to delete when it not appear in newIdPaticipant
        const usersToRemoves = listUserIds.filter(
            (userId) => !newIdPaticipants.includes(userId),
        )

        await Promise.all([
            ...usersToRemoves.map((usersToRemove) =>
                this.userMeetingRepository.removeUserFromMeeting(
                    usersToRemove,
                    meetingId,
                    meetingRole,
                ),
            ),
            ...usersToAdds.map((usersToAdd) =>
                this.createUserMeeting({
                    userId: usersToAdd,
                    meetingId: meetingId,
                    role: meetingRole,
                }),
            ),
        ])

        return addedUsersFollowRole
    }

    async getAllIdsParticipantsInMeeting(meetingId: number): Promise<number[]> {
        const idsParticipants =
            await this.userMeetingRepository.getAllIdsParticipantInMeeting(
                meetingId,
            )
        return idsParticipants
    }
    async saveStatusUserMeeting(user: UserMeeting): Promise<UserMeeting> {
        const userMeeting =
            await this.userMeetingRepository.saveStatusUserMeeting(user)
        return userMeeting
    }

    async getAllParticipantsInMeeting(meetingId: number): Promise<number[]> {
        const idsParticipants =
            await this.userMeetingRepository.getAllIdsParticipantInMeeting(
                meetingId,
            )
        return idsParticipants
    }

    async getUserMeetingByUserIdAndMeetingId(
        userId: number,
        meetingId: number,
    ): Promise<UserMeeting> {
        const userMeeting = await this.userMeetingRepository.findOne({
            where: {
                userId,
                meetingId,
            },
        })
        return userMeeting
    }

    async getListUserIdPaticipantsByMeetingId(
        meetingId: number,
        meetingRole: MeetingRole,
    ): Promise<number[]> {
        const listIdUserMeetingFollowRoles =
            await this.userMeetingRepository.getListUserIdPaticipantsByMeetingId(
                meetingId,
                meetingRole,
            )
        return listIdUserMeetingFollowRoles
    }
}
