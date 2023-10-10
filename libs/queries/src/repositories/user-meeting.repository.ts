import { Repository } from 'typeorm'
import { CustomRepository } from '@shares/decorators'
import { UserMeeting } from '@entities/user-meeting.entity'
import { CreateUserMeetingDto } from '@dtos/user-meeting.dto'
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
}
