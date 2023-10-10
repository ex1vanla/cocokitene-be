import { Meeting } from '@entities/meeting.entity'
import { UserMeeting } from '@entities/user-meeting.entity'

export interface DetailMeetingResponse extends Partial<Meeting> {
    hosts: Partial<UserMeeting>[]
    controlBoards: Partial<UserMeeting>[]
    directors: Partial<UserMeeting>[]
    administrativeCouncils: Partial<UserMeeting>[]
    shareholders: Partial<UserMeeting>[]
    shareholdersTotal: number
    shareholdersJoined: number
}
