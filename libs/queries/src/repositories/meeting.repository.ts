import { Repository } from 'typeorm'
import { CustomRepository } from '@shares/decorators'
import {
    IPaginationOptions,
    paginate,
    Pagination,
} from 'nestjs-typeorm-paginate'
import { Meeting } from '@entities/meeting.entity'
import { CreateMeetingDto, GetAllMeetingDto } from '../dtos'
import { MeetingType } from '@shares/constants/meeting.const'

@CustomRepository(Meeting)
export class MeetingRepository extends Repository<Meeting> {
    async getAllMeetings(
        companyId: number,
        options: IPaginationOptions & GetAllMeetingDto,
    ): Promise<Pagination<Meeting>> {
        const searchQuery = options.searchQuery || ''
        const sortField = options.sortField
        const sortOrder = options.sortOrder
        const type = options.type
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
            .where('meetings.companyId= :companyId', {
                companyId: companyId,
            })
            .andWhere('meetings.title LIKE :searchQuery', {
                searchQuery: `%${searchQuery}%`,
            })
        if (type == MeetingType.FUTURE) {
            queryBuilder.andWhere('meetings.startTime >= :currentDateTime', {
                currentDateTime: new Date(),
            })
        } else {
            queryBuilder.andWhere('meetings.endTime <= :currentDateTime', {
                currentDateTime: new Date(),
            })
        }
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

    async createMeeting(
        createMeetingDto: CreateMeetingDto,
        creatorId: number,
        companyId: number,
    ): Promise<Meeting> {
        const meeting = await this.create({
            ...createMeetingDto,
            creatorId,
            companyId,
        })
        await meeting.save()
        return meeting
    }
}
