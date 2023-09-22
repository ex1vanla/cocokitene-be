import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { MeetingRepository } from '@repositories/meeting.repository'

import { Meeting } from '@entities/meeting.entity'
import { Pagination } from 'nestjs-typeorm-paginate'
import { UserRepository } from '@repositories/user.repository'
import { CompanyService } from '@api/modules/companys/company.service'
import { UserMeeting } from '@entities/user-meeting.entity'
import { httpErrors } from '@shares/exception-filter'
import { UserMeetingRepoisitory } from '@repositories/user-meeting.repoisitory'
import { UserMeetingStatusEnum } from '@shares/constants/meeting.const'
import {
    AttendMeetingDto,
    GetAllMeetingDto,
} from 'libs/queries/src/dtos/meeting.dto'

@Injectable()
export class MeetingService {
    constructor(
        private readonly meetingRepository: MeetingRepository,
        private readonly userRepository: UserRepository,
        private readonly companyService: CompanyService,
        private readonly userMeetingRepoisitory: UserMeetingRepoisitory,
    ) {}

    async getAllMeetings(
        getAllMeetingDto: GetAllMeetingDto,
        companyId: number,
    ): Promise<Pagination<Meeting>> {
        const meetings = await this.meetingRepository.getAllMeetings(
            companyId,
            getAllMeetingDto,
        )
        return meetings
    }

    async attendanceMeeting(
        attendMeetingDto: AttendMeetingDto,
        userId: number,
    ): Promise<UserMeeting> {
        const { meetingId } = attendMeetingDto
        const userMeeting =
            await this.userMeetingRepoisitory.getMeetingByMeetingId(
                meetingId,
                userId,
            )

        if (!userMeeting) {
            throw new HttpException(
                httpErrors.MEETING_NOT_EXISTED,
                HttpStatus.NOT_FOUND,
            )
        }
        userMeeting.status = UserMeetingStatusEnum.PARTICIPATE
        return userMeeting
    }
}
