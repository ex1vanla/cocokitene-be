import { Repository } from 'typeorm'
import { CustomRepository } from '@shares/decorators'
import {
    IPaginationOptions,
    paginateRaw,
    Pagination,
} from 'nestjs-typeorm-paginate'
import { Meeting } from '@entities/meeting.entity'
import { CreateMeetingDto, GetAllMeetingDto } from '../dtos'
import { MeetingType } from '@shares/constants/meeting.const'

@CustomRepository(Meeting)
export class MeetingRepository extends Repository<Meeting> {
    async getAllMeetings(
        companyId: number,
        userId: number,
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
                'meetings.status',
            ])
            .leftJoin(
                'user_meetings',
                'userMeeting',
                'userMeeting.meetingId = meetings.id AND userMeeting.userId = :userId',
                { userId },
            )
            .addSelect(
                `(CASE 
                WHEN userMeeting.status = 'participate' THEN true
                ELSE false 
            END)`,
                'isJoined',
            )

            .where('meetings.companyId= :companyId', {
                companyId: companyId,
            })
            .andWhere('meetings.title LIKE :searchQuery', {
                searchQuery: `%${searchQuery}%`,
            })
        if (type == MeetingType.FUTURE) {
            queryBuilder.andWhere(
                'meetings.startTime >= :currentDateTime OR (meetings.startTime <= :currentDateTime AND meetings.endTime >= :currentDateTime)',
                {
                    currentDateTime: new Date(),
                },
            )
        } else {
            queryBuilder.andWhere('meetings.endTime <= :currentDateTime', {
                currentDateTime: new Date(),
            })
        }
        if (sortField && sortOrder) {
            queryBuilder.orderBy(`meetings.${sortField}`, sortOrder)
        }
        return paginateRaw(queryBuilder, options)
    }

    async getMeetingByIdAndCompanyId(
        id: number,
        companyId: number,
    ): Promise<Meeting> {
        // const meeting = await this.findOne({
        //     where: {
        //         id,
        //         companyId,
        //     },
        //     relations: ['creator', 'meetingFiles', 'proposals'],
        // })

        const meeting = await this.createQueryBuilder('meeting')
            .select()
            .where('meeting.id = :id', {
                id,
            })
            .andWhere('meeting.companyId = :companyId', {
                companyId,
            })
            .leftJoinAndSelect('meeting.meetingFiles', 'meetingFiles')
            .getOne()

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
