import { Brackets, Repository } from 'typeorm'
import { CustomRepository } from '@shares/decorators'
import {
    IPaginationOptions,
    paginateRaw,
    Pagination,
} from 'nestjs-typeorm-paginate'
import { Meeting } from '@entities/meeting.entity'
import {
    CreateMeetingDto,
    GetAllMeetingDto,
    GetAllMeetingInDayDto,
    StatisticMeetingInMonthDto,
    UpdateMeetingDto,
} from '../dtos'
import {
    MeetingTime,
    MeetingType,
    StatusMeeting,
} from '@shares/constants/meeting.const'
import { CreateBoardMeetingDto } from '@dtos/board-meeting.dto'

@CustomRepository(Meeting)
export class MeetingRepository extends Repository<Meeting> {
    async getAllMeetings(
        companyId: number,
        userId: number,
        canUserCreateMeeting: boolean,
        options: IPaginationOptions & GetAllMeetingDto,
    ): Promise<Pagination<Meeting>> {
        const currentDateTime = new Date()
        const searchQuery = options.searchQuery || ''
        const sortField = options.sortField
        const sortOrder = options.sortOrder
        const type = options.type
        const meetingType = options.meetingType
        const queryBuilder = this.createQueryBuilder('meetings')
            .select([
                'meetings.id',
                'meetings.title',
                'meetings.startTime',
                'meetings.endTime',
                'meetings.meetingLink',
                'meetings.status',
                'meetings.note',
                'meetings.type',
                'meetings.companyId',
            ])
            .distinct(true)
        if (canUserCreateMeeting) {
            queryBuilder.leftJoin(
                'meeting_participant',
                'userMeeting',
                'userMeeting.meetingId = meetings.id AND userMeeting.userId = :userId',
                { userId },
            )
        } else {
            queryBuilder.innerJoin(
                'meeting_participant',
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

            .addSelect(
                `(CASE 
                WHEN userMeeting.status THEN true
                ELSE false 
            END)`,
                'isParticipant',
            )

        if (searchQuery) {
            queryBuilder.andWhere('(meetings.title like :searchQuery)', {
                searchQuery: `%${searchQuery}%`,
            })
        }
        if (meetingType) {
            queryBuilder.andWhere('meetings.type = :typeMeeting', {
                typeMeeting: meetingType,
            })
        }
        if (sortField && sortOrder) {
            queryBuilder.orderBy(`meetings.${sortField}`, sortOrder)
        }

        if (type == MeetingTime.FUTURE) {
            queryBuilder.andWhere(
                new Brackets((qb) => {
                    qb.where(
                        'meetings.startTime <= :currentDateTime AND meetings.endTime >= :currentDateTime',
                        { currentDateTime: currentDateTime },
                    ).orWhere('meetings.startTime >= :currentDateTime', {
                        currentDateTime: currentDateTime,
                    })
                }),
            )
        } else {
            queryBuilder.andWhere('meetings.endTime <= :currentDateTime ', {
                currentDateTime: new Date(),
            })
            queryBuilder.leftJoin('meetings.transaction', 'transaction')
            queryBuilder.addSelect([
                'transaction.keyQuery',
                'transaction.contractAddress',
            ])
        }

        return paginateRaw(queryBuilder, options)
    }

    async getInternalListMeeting(
        companyId: number,
        options: IPaginationOptions & GetAllMeetingDto,
    ): Promise<Meeting[]> {
        const currentDateTime = new Date()
        const searchQuery = options.searchQuery || ''
        const sortField = options.sortField
        const sortOrder = options.sortOrder
        const type = options.type
        const meetingType = options.meetingType
        const queryBuilder = this.createQueryBuilder('meetings')
            .select(['meetings.id', 'meetings.companyId', 'meetings.type'])
            .where('meetings.companyId= :companyId', {
                companyId: companyId,
            })

        if (type == MeetingTime.FUTURE) {
            queryBuilder.andWhere(
                '(meetings.startTime >= :currentDateTime OR (meetings.startTime <= :currentDateTime AND meetings.endTime >= :currentDateTime))',
                {
                    currentDateTime: currentDateTime,
                },
            )
        } else {
            queryBuilder.andWhere('meetings.endTime <= :currentDateTime', {
                currentDateTime: currentDateTime,
            })
        }
        if (meetingType) {
            queryBuilder.andWhere('meetings.type = :typeMeeting', {
                typeMeeting: meetingType,
            })
        }
        if (searchQuery) {
            queryBuilder.andWhere('(meetings.title like :searchQuery)', {
                searchQuery: `%${searchQuery}%`,
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
            .leftJoinAndSelect('meeting.personnelVoting', 'personnelVoting')
            .leftJoinAndSelect('personnelVoting.candidate', 'candidate')
            .leftJoin('personnelVoting.typeElection', 'typeElection')
            .addSelect([
                'typeElection.id',
                'typeElection.status',
                'typeElection.description',
            ])

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
        typeMeeting: MeetingType,
        creatorId: number,
        companyId: number,
    ): Promise<Meeting> {
        const meeting = await this.create({
            ...createMeetingDto,
            type: typeMeeting,
            creatorId,
            companyId,
        })
        await meeting.save()
        return meeting
    }

    async updateMeeting(
        meetingId: number,
        updateMeetingDto: UpdateMeetingDto,
        updaterId: number,
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
                updaterId: updaterId,
            })
            .where('meetings.id = :meetingId', { meetingId })
            .execute()
        const meeting = await this.getMeetingByMeetingIdAndCompanyId(
            meetingId,
            companyId,
        )
        return meeting
    }

    async findMeetingByStatusAndEndTimeVoting(
        status: StatusMeeting,
        meetingIdsAppearedInTransaction,
    ): Promise<Meeting[]> {
        const queryBuilder = this.createQueryBuilder('meetings').select([
            'meetings.id',
            'meetings.title',
            'meetings.startTime',
            'meetings.endTime',
            'meetings.endVotingTime',
            'meetings.meetingLink',
            'meetings.status',
            'meetings.companyId',
            'meetings.type',
        ])
        if (
            meetingIdsAppearedInTransaction &&
            meetingIdsAppearedInTransaction.length > 0
        ) {
            queryBuilder.where(
                'meetings.id NOT IN (:...meetingIdsAppearedInTransaction)',
                { meetingIdsAppearedInTransaction },
            )
        }
        queryBuilder
            .andWhere('meetings.status = :status', {
                status: status,
            })
            .andWhere('meetings.endVotingTime < :currentDateTime', {
                currentDateTime: new Date(),
            })

        const meetings = await queryBuilder.getMany()
        return meetings
    }

    //Board Meeting
    async createBoardMeeting(
        createMeetingDto: CreateBoardMeetingDto,
        typeMeeting: MeetingType,
        creatorId: number,
        companyId: number,
    ): Promise<Meeting> {
        const meeting = await this.create({
            ...createMeetingDto,
            type: typeMeeting,
            creatorId,
            companyId,
        })
        await meeting.save()
        return meeting
    }

    async getBoardMeetingByIdAndCompanyId(
        meetingId: number,
        companyId: number,
    ): Promise<Meeting> {
        const boardMeeting = await this.createQueryBuilder('meeting')
            .where('meeting.id = :id', { id: meetingId })
            .andWhere('meeting.companyId = :companyId', { companyId })
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
            .leftJoinAndSelect('meeting.personnelVoting', 'personnelVoting')
            .leftJoinAndSelect('personnelVoting.candidate', 'candidate')
            .leftJoin('personnelVoting.typeElection', 'typeElection')
            .addSelect([
                'typeElection.id',
                'typeElection.status',
                'typeElection.description',
            ])

            .getOne()

        return boardMeeting
    }

    async getAllMeetingsInDay(
        companyId: number,
        userId: number,
        canUserCreateMeeting: boolean,
        options: IPaginationOptions & GetAllMeetingInDayDto,
    ): Promise<Pagination<Meeting>> {
        try {
            const { date } = options
            const newDate = new Date(date)
            // const endOfDay = new Date(date)
            // startOfDay.setUTCHours(0, 0, 0, 0)
            // endOfDay.setUTCHours(23, 59, 59, 999)

            const queryBuilder = this.createQueryBuilder('meetings')
                .select([
                    'meetings.id',
                    'meetings.title',
                    'meetings.startTime',
                    'meetings.endTime',
                    'meetings.meetingLink',
                    'meetings.status',
                    'meetings.note',
                    'meetings.companyId',
                ])
                .distinct(true)
            if (canUserCreateMeeting) {
                queryBuilder.leftJoin(
                    'meeting_participant',
                    'userMeeting',
                    'userMeeting.meetingId = meetings.id AND userMeeting.userId = :userId',
                    { userId },
                )
            } else {
                queryBuilder.innerJoin(
                    'meeting_participant',
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

                .addSelect(
                    `(CASE 
                    WHEN userMeeting.status THEN true
                    ELSE false 
                END)`,
                    'isParticipant',
                )
            queryBuilder.andWhere(
                'DATE_FORMAT(meetings.startTime,"%Y-%m-%d 00:00:00") <= :newDate AND DATE_ADD(DATE(meetings.endTime), INTERVAL 1 DAY) - INTERVAL 1 SECOND >= :newDate',
                {
                    newDate: newDate,
                },
            )

            return paginateRaw(queryBuilder, options)
        } catch (error) {
            console.log('Error Query: ', error)
        }
    }

    async getMeetingCreatedInMonth(
        companyId: number,
        type: MeetingType,
        options: StatisticMeetingInMonthDto,
    ): Promise<Meeting[]> {
        try {
            const { date } = options
            const startOfMonth = new Date(date)
            startOfMonth.setUTCDate(1)
            startOfMonth.setUTCHours(0, 0, 0, 0)

            const dateTime = new Date(date)
            const endOfMonth = new Date(
                Date.UTC(
                    dateTime.getUTCFullYear(),
                    dateTime.getUTCMonth() + 1,
                    0,
                ),
            )
            endOfMonth.setUTCHours(23, 59, 59, 999)

            const meeting = await this.createQueryBuilder('meetings')
                .select([
                    'meetings.id',
                    'meetings.title',
                    'meetings.startTime',
                    'meetings.endTime',
                    'meetings.companyId',
                    'meetings.type',
                ])
                .where('meetings.companyId = :companyId ', {
                    companyId: companyId,
                })
                .andWhere('meetings.type = :type', {
                    type: type,
                })
                .andWhere(
                    'meetings.startTime >= :startOfMonth AND meetings.startTime <= :endOfMonth',
                    {
                        startOfMonth: startOfMonth,
                        endOfMonth: endOfMonth,
                    },
                )
                .leftJoinAndSelect('meetings.participant', 'participant')
                .getMany()

            return meeting
        } catch (error) {
            console.log('Query Meeting in Month Failed: ', error)
        }
    }

    async getMeetingInMonth(
        month: number,
        year: number,
        userId: number,
        companyId: number,
        canUserCreateMeeting: boolean,
    ): Promise<Pagination<Meeting>> {
        const queryBuilder = this.createQueryBuilder('meetings')
            .select([
                'meetings.id',
                'meetings.startTime',
                'meetings.endTime',
                'meetings.companyId',
                'meetings.type',
            ])
            .distinct(true)
        if (canUserCreateMeeting) {
            queryBuilder.leftJoin(
                'meeting_participant',
                'userMeeting',
                'userMeeting.meetingId = meetings.id AND userMeeting.userId = :userId',
                { userId },
            )
        } else {
            queryBuilder.innerJoin(
                'meeting_participant',
                'userMeeting',
                'userMeeting.meetingId = meetings.id AND userMeeting.userId = :userId',
                { userId },
            )
        }
        queryBuilder.where('meetings.companyId= :companyId', {
            companyId: companyId,
        })
        queryBuilder.andWhere(
            '((MONTH(meetings.startTime) = :month AND YEAR(meetings.startTime) = :year) OR (MONTH(meetings.endTime) = :month AND YEAR(meetings.endTime) = :year))',
            {
                month: month,
                year: year,
            },
        )

        return paginateRaw(queryBuilder, {
            limit: 100,
            page: 1,
        })
    }
}
