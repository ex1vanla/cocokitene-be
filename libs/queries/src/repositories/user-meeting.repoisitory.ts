import { Repository } from 'typeorm'
import { CustomRepository } from '@shares/decorators'
import { UserMeeting } from '@entities/user-meeting.entity'
@CustomRepository(UserMeeting)
export class UserMeetingRepoisitory extends Repository<UserMeeting> {}
