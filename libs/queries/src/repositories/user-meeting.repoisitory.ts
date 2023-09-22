import { Repository } from 'typeorm'
import { CustomRepository } from '@shares/decorators'
import { UserMeeting } from '@entities/user-meeting.entity'
@CustomRepository(UserMeeting)
export class UserMeetingRepoisitory extends Repository<UserMeeting> {
    async getMeetingByMeetingId(
        meetingId: number,
        userId: number,
    ): Promise<UserMeeting> {
        const meeting = await this.createQueryBuilder('user_meetings')
            .leftJoinAndSelect('user_meetings.user', 'user')
            .leftJoinAndSelect('user_meetings.meeting', 'meeting')
            .where('user.id= :userId', {
                userId,
            })
            .andWhere('meeting.id= :meetingId', {
                meetingId,
            })
            .getOne()
        return meeting
    }
}
