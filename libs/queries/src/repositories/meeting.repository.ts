import { Repository } from 'typeorm'
import { CustomRepository } from '@shares/decorators'
import {
    IPaginationOptions,
    paginateRaw,
    Pagination,
} from 'nestjs-typeorm-paginate'
import { Meeting } from '@entities/meeting.entity'
import { CreateMeetingDto, GetAllMeetingDto, UpdateMeetingDto } from '../dtos'
import { MeetingType } from '@shares/constants/meeting.const'

@CustomRepository(Meeting)
export class MeetingRepository extends Repository<Meeting> {
    async getAllMeetings(
        companyId: number,
        userId: number,
        canUserCreateMeeting: boolean,
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
                'meetings.note',
            ])
            .distinct(true)
        if (canUserCreateMeeting) {
            queryBuilder.leftJoin(
                'user_meetings',
                'userMeeting',
                'userMeeting.meetingId = meetings.id AND userMeeting.userId = :userId',
                { userId },
            )
        } else {
            queryBuilder.innerJoin(
                'user_meetings',
                'userMeeting',
                'userMeeting.meetingId = meetings.id AND userMeeting.userId = :userId',
                { userId },
            )
        }

        queryBuilder
            .addSelect(
                `(CASE 
                WHEN userMeeting.status = '0' THEN true
                ELSE false 
            END)`,
                'isJoined',
            )

            .where('meetings.companyId= :companyId', {
                companyId: companyId,
            })
        if (searchQuery) {
            queryBuilder.andWhere('(meetings.title like :searchQuery)', {
                searchQuery: `%${searchQuery}%`,
            })
        }
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

    async getInternalListMeeting(
        companyId: number,
        options: IPaginationOptions & GetAllMeetingDto,
    ): Promise<Meeting[]> {
        const searchQuery = options.searchQuery || ''
        const sortField = options.sortField
        const sortOrder = options.sortOrder
        const type = options.type
        const queryBuilder = this.createQueryBuilder('meetings')
            .select(['meetings.id'])
            .where('meetings.companyId= :companyId', {
                companyId: companyId,
            })
        if (searchQuery) {
            queryBuilder.andWhere('(meetings.title like :searchQuery)', {
                searchQuery: `%${searchQuery}%`,
            })
        }
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
        const listMeetings = await queryBuilder.getMany()
        return listMeetings
    }

    async getInternalMeetingById(id: number): Promise<Meeting> {
        const meeting = await this.createQueryBuilder('meeting')
            .select()
            .where('meeting.id = :id', {
                id,
            })
            .leftJoinAndSelect('meeting.meetingFiles', 'meetingFiles')
            .leftJoinAndSelect('meeting.proposals', 'proposals')
            .getOne()

        return meeting
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
            .leftJoinAndSelect('meeting.proposals', 'proposals')
            .leftJoin('proposals.creator', 'creator')
            .addSelect([
                'creator.username',
                'creator.email',
                'creator.avatar',
                'creator.defaultAvatarHashColor',
            ])
            .leftJoinAndSelect('proposals.proposalFiles', 'proposalFiles')
            // .addSelect(['proposalFiles.url', 'proposalFiles.id'])
            .getOne()

        return meeting
    }
    async getMeetingByMeetingIdAndCompanyId(
        id: number,
        companyId: number,
    ): Promise<Meeting> {
        const meeting = await this.findOne({
            where: {
                id,
                companyId,
            },
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

    async updateMeeting(
        meetingId: number,
        updateMeetingDto: UpdateMeetingDto,
        creatorId: number,
        companyId: number,
    ): Promise<Meeting> {
        await this.createQueryBuilder('meetings')
            .update(Meeting)
            .set({
                title: updateMeetingDto.title,
                note: updateMeetingDto.note,
                startTime: updateMeetingDto.startTime,
                endTime: updateMeetingDto.endTime,
                endVotingTime: updateMeetingDto.endVotingTime,
                meetingLink: updateMeetingDto.meetingLink,
                status: updateMeetingDto.status,
            })
            .where('meetings.id = :meetingId', { meetingId })
            .execute()
        const meeting = await this.getMeetingByMeetingIdAndCompanyId(
            meetingId,
            companyId,
        )
        return meeting
    }
}
