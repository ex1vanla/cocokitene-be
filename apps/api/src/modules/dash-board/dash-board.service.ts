import { Injectable } from '@nestjs/common'
import { MeetingService } from '../meetings/meeting.service'
import { GetAllMeetingInDayDto } from '@dtos/meeting.dto'
import { User } from '@entities/user.entity'
import { Pagination } from 'nestjs-typeorm-paginate'
import { Meeting } from '@entities/meeting.entity'

@Injectable()
export class DashBoardService {
    constructor(private readonly meetingService: MeetingService) {}

    async getAllMeetingInDay(
        getAllMeetingInDayDto: GetAllMeetingInDayDto,
        user: User,
        companyId: number,
    ): Promise<Pagination<Meeting>> {
        const meetingInDay = await this.meetingService.getAllMeetingsInDay(
            getAllMeetingInDayDto,
            user,
            companyId,
        )
        return meetingInDay
    }
}
