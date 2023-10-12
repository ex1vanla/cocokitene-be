import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { MeetingRepository } from '@repositories/meeting.repository'

import { MeetingFileService } from '@api/modules/meeting-files/meeting-file.service'
import { DetailMeetingResponse } from '@api/modules/meetings/meeting.interface'
import { ProposalService } from '@api/modules/proposals/proposal.service'
import { UserMeetingService } from '@api/modules/user-meetings/user-meeting.service'
import { Meeting } from '@entities/meeting.entity'
import { UserMeeting } from '@entities/user-meeting.entity'
import { UserMeetingRepository } from '@repositories/user-meeting.repository'
import {
    MeetingRole,
    StatusMeeting,
    UserMeetingStatusEnum,
} from '@shares/constants/meeting.const'
import { httpErrors } from '@shares/exception-filter'
import { enumToArray } from '@shares/utils/enum'
import {
    AttendMeetingDto,
    CreateMeetingDto,
    GetAllMeetingDto,
} from 'libs/queries/src/dtos/meeting.dto'
import { Pagination } from 'nestjs-typeorm-paginate'

@Injectable()
export class MeetingService {
    constructor(
        private readonly meetingRepository: MeetingRepository,
        private readonly userMeetingRepository: UserMeetingRepository,
        private readonly meetingFileService: MeetingFileService,
        private readonly proposalService: ProposalService,
        private readonly userMeetingService: UserMeetingService,
    ) {}

    async getAllMeetings(
        getAllMeetingDto: GetAllMeetingDto,
        userId: number,
        companyId: number,
    ): Promise<Pagination<Meeting>> {
        const meetings = await this.meetingRepository.getAllMeetings(
            companyId,
            userId,
            getAllMeetingDto,
        )
        return meetings
    }

    async attendanceMeeting(
        attendMeetingDto: AttendMeetingDto,
        userId: number,
    ): Promise<UserMeeting> {
        const { meetingId } = attendMeetingDto
        let userMeeting: UserMeeting
        try {
            userMeeting = await this.userMeetingRepository.findOne({
                where: {
                    userId: userId,
                    meetingId: meetingId,
                },
                relations: ['meeting'],
            })
            if (!userMeeting) {
                throw new HttpException(
                    httpErrors.USER_MEETING_NOT_FOUND,
                    HttpStatus.NOT_FOUND,
                )
            }
            const currentDate = new Date()
            const startTimeMeeting = new Date(userMeeting.meeting.startTime)
            const endTimeMeeting = new Date(userMeeting.meeting.endTime)

            if (userMeeting.meeting.status == StatusMeeting.CANCELED) {
                throw new HttpException(
                    httpErrors.MEETING_HAS_CANCELED,
                    HttpStatus.BAD_REQUEST,
                )
            } else if (userMeeting.meeting.status == StatusMeeting.DELAYED) {
                throw new HttpException(
                    httpErrors.MEETING_HAS_DELAYED,
                    HttpStatus.BAD_REQUEST,
                )
            } else if (currentDate < startTimeMeeting) {
                throw new HttpException(
                    httpErrors.MEETING_NOT_START,
                    HttpStatus.BAD_REQUEST,
                )
            } else if (
                currentDate >= startTimeMeeting &&
                currentDate <= endTimeMeeting
            ) {
                userMeeting.status = UserMeetingStatusEnum.PARTICIPATE
            }
            await userMeeting.save()
            return userMeeting
        } catch (error) {
            throw new HttpException(
                {
                    message: error.message,
                },
                HttpStatus.BAD_REQUEST,
            )
        }
    }

    async createMeeting(
        createMeetingDto: CreateMeetingDto,
        creatorId: number,
        companyId: number,
    ) {
        // create meeting
        if (!creatorId) {
            throw new HttpException(
                httpErrors.USER_NOT_FOUND,
                HttpStatus.BAD_REQUEST,
            )
        }

        if (!companyId) {
            throw new HttpException(
                httpErrors.COMPANY_NOT_FOUND,
                HttpStatus.BAD_REQUEST,
            )
        }

        // create project
        let createdMeeting: Meeting
        try {
            createdMeeting = await this.meetingRepository.createMeeting(
                createMeetingDto,
                creatorId,
                companyId,
            )
        } catch (error) {
            throw new HttpException(
                httpErrors.MEETING_CREATE_FAILED,
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }

        const {
            meetingReports,
            meetingInvitations,
            resolutions,
            amendmentResolutions,
            hosts,
            controlBoards,
            directors,
            administrativeCouncils,
            shareholders,
        } = createMeetingDto

        try {
            await Promise.all([
                ...meetingReports.map((report) =>
                    this.meetingFileService.createMeetingFile({
                        url: report.url,
                        meetingId: createdMeeting.id,
                        fileType: report.fileType,
                    }),
                ),
                ...meetingInvitations.map((invitation) =>
                    this.meetingFileService.createMeetingFile({
                        url: invitation.url,
                        meetingId: createdMeeting.id,
                        fileType: invitation.fileType,
                    }),
                ),
                ...resolutions.map((resolution) =>
                    this.proposalService.createProposal({
                        title: resolution.title,
                        description: resolution.description,
                        type: resolution.type,
                        meetingId: createdMeeting.id,
                        creatorId: creatorId,
                    }),
                ),
                ...amendmentResolutions.map((amendmentResolution) =>
                    this.proposalService.createProposal({
                        title: amendmentResolution.title,
                        description: amendmentResolution.description,
                        type: amendmentResolution.type,
                        meetingId: createdMeeting.id,
                        creatorId: creatorId,
                    }),
                ),
                ...hosts.map((host) =>
                    this.userMeetingService.createUserMeeting({
                        userId: host,
                        meetingId: createdMeeting.id,
                        role: MeetingRole.HOST,
                    }),
                ),
                ...controlBoards.map((controlBoard) =>
                    this.userMeetingService.createUserMeeting({
                        userId: controlBoard,
                        meetingId: createdMeeting.id,
                        role: MeetingRole.CONTROL_BOARD,
                    }),
                ),
                ...directors.map((director) =>
                    this.userMeetingService.createUserMeeting({
                        userId: director,
                        meetingId: createdMeeting.id,
                        role: MeetingRole.DIRECTOR,
                    }),
                ),
                ...administrativeCouncils.map((administrativeCouncil) =>
                    this.userMeetingService.createUserMeeting({
                        userId: administrativeCouncil,
                        meetingId: createdMeeting.id,
                        role: MeetingRole.ADMINISTRATIVE_COUNCIL,
                    }),
                ),
                ...shareholders.map((shareholder) =>
                    this.userMeetingService.createUserMeeting({
                        userId: shareholder,
                        meetingId: createdMeeting.id,
                        role: MeetingRole.SHAREHOLDER,
                    }),
                ),
            ])
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }

        return createdMeeting
    }

    async getMeetingById(
        meetingId: number,
        companyId: number,
    ): Promise<DetailMeetingResponse> {
        const meeting = await this.meetingRepository.getMeetingByIdAndCompanyId(
            meetingId,
            companyId,
        )
        if (!meeting) {
            throw new HttpException(
                httpErrors.MEETING_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            )
        }

        const [
            hosts,
            controlBoards,
            directors,
            administrativeCouncils,
            shareholders,
        ] = await Promise.all(
            enumToArray(MeetingRole).map((role) =>
                this.userMeetingService.getUserMeetingByMeetingIdAndRole(
                    meetingId,
                    role,
                ),
            ),
        )

        const shareholdersTotal = shareholders.length
        const shareholdersJoined = shareholders.reduce(
            (accumulator, currentValue) => {
                accumulator =
                    currentValue.status === UserMeetingStatusEnum.PARTICIPATE
                        ? accumulator + 1
                        : accumulator
                return accumulator
            },
            0,
        )

        return {
            ...meeting,
            hosts,
            controlBoards,
            directors,
            administrativeCouncils,
            shareholders,
            shareholdersTotal,
            shareholdersJoined,
        }
    }
}
