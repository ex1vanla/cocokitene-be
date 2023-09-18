import { Repository } from 'typeorm'
import { CustomRepository } from '@shares/decorators'
import {
    IPaginationOptions,
    paginate,
    Pagination,
} from 'nestjs-typeorm-paginate'
import { Meeting } from '@entities/meeting.entity'
@CustomRepository(Meeting)
export class MeetingRepository extends Repository<Meeting> {
    async getAllMeetings(
        options: IPaginationOptions,
    ): Promise<Pagination<Meeting>> {
        const queryBuilder = this.createQueryBuilder('meetings')
            .select([
                'meetings.id',
                'meetings.title',
                'meetings.startTime',
                'meetings.endTime',
                'meetings.meetingLink',
                'meetings.meetingReport',
                'meetings.meetingInvitation',
            ])
            .leftJoinAndSelect('meetings.company', 'company')
        return paginate(queryBuilder, options)
    }

    async getMeetingById(id: number): Promise<Meeting> {
        const meeting = await this.findOne({
            where: {
                id,
            },
            relations: ['company', 'creator'],
        })
        return meeting
    }
}
