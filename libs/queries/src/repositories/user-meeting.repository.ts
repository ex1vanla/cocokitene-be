import { Repository } from 'typeorm'
import { CustomRepository } from '@shares/decorators'
import { UserMeeting } from '@entities/user-meeting.entity'
import { CreateUserMeetingDto } from '@dtos/user-meeting.dto'
import { MeetingRole } from '@shares/constants/meeting.const'
@CustomRepository(UserMeeting)
export class UserMeetingRepository extends Repository<UserMeeting> {
    async createUserMeeting(
        createUserMeetingDto: CreateUserMeetingDto,
    ): Promise<UserMeeting> {
        const { userId, meetingId, role } = createUserMeetingDto

        const createdUserMeeting = await this.create({
            userId,
            meetingId,
            role,
        })
        return await createdUserMeeting.save()
        // return createdUserMeeting
    }

    async getUserMeetingByMeetingIdAndRole(
        meetingId: number,
        role: MeetingRole,
    ): Promise<UserMeeting[]> {
        const userMeetingList = await this.find({
            where: {
                meetingId,
                role,
            },
            select: {
                id: true,
                status: true,
                user: {
                    id: true,
                    username: true,
                    email: true,
                    avatar: true,
                    defaultAvatarHashColor: true,
                },
            },
            relations: ['user'],
        })

        return userMeetingList
    }

    async getListUserIdPaticipantsByMeetingId(
        meetingId: number,
        meetingRole: MeetingRole,
    ): Promise<number[]> {
        const listUserMeetingFollowRoles = await this.find({
            where: {
                meetingId: meetingId,
                role: meetingRole,
            },
        })
        const listIdUserMeetingFollowRoles = listUserMeetingFollowRoles.map(
            (listUserMeetingFollowRole) => listUserMeetingFollowRole.userId,
        )
        return listIdUserMeetingFollowRoles
    }

    async removeUserFromMeeting(
        userId: number,
        meetingId: number,
        meetingRole: MeetingRole,
    ) {
        const existeduserMeeting = await this.findOne({
            where: {
                userId: userId,
                meetingId: meetingId,
                role: meetingRole,
            },
        })

        if (existeduserMeeting) {
            await this.remove(existeduserMeeting)
        }
    }
}
