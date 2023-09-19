import { Repository } from 'typeorm'
import { CustomRepository } from '@shares/decorators'
import {
    IPaginationOptions,
    paginate,
    Pagination,
} from 'nestjs-typeorm-paginate'
import { Meeting } from '@entities/meeting.entity'
import { GetAllMeetingDto } from '../dtos'
@CustomRepository(Meeting)
export class MeetingRepository extends Repository<Meeting> {
    async getAllMeetings(
        options: IPaginationOptions & GetAllMeetingDto,
    ): Promise<Pagination<Meeting>> {
        const searchQuery = options.searchQuery || ''
        const sortField = options.sortField
        const sortOrder = options.sortOrder
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
            .where('meetings.title LIKE :searchQuery', {
                searchQuery: `%${searchQuery}%`,
            })

        if (sortField && sortOrder) {
            queryBuilder.orderBy(`meetings.${sortField}`, sortOrder)
        }
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
