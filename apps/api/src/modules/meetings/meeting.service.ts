import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { MeetingRepository } from '@repositories/meeting.repository'

import { Meeting } from '@entities/meeting.entity'
import { Pagination } from 'nestjs-typeorm-paginate'
import { UserRepository } from '@repositories/user.repository'
import { CompanyService } from '@api/modules/companys/company.service'
import { UserMeeting } from '@entities/user-meeting.entity'
import { httpErrors } from '@shares/exception-filter'
import { uuid } from '@shares/utils/uuid'
import { UserMeetingRepoisitory } from '@repositories/user-meeting.repoisitory'
import { getSignedMessage, isValidSignature } from '@shares/utils/web3'
import { UserStatusEnum } from '@shares/constants'
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
    ): Promise<Pagination<Meeting>> {
        const meetings = await this.meetingRepository.getAllMeetings(
            getAllMeetingDto,
        )
        return meetings
    }

    async attendanceMeeting(
        attendMeetingDto: AttendMeetingDto,
    ): Promise<UserMeeting> {
        const { meetingId, walletAddress, signature } = attendMeetingDto
        // check user exist
        const user = await this.userRepository.getUserByWalletAddress(
            walletAddress,
            UserStatusEnum.ACTIVE,
        )
        if (!user) {
            throw new HttpException(
                httpErrors.USER_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            )
        }
        // get message have to sign
        const signedMessage = getSignedMessage(user.nonce)
        // // verify signature
        if (!isValidSignature(walletAddress, signature, signedMessage)) {
            throw new HttpException(
                httpErrors.INVALID_SIGNATURE,
                HttpStatus.BAD_REQUEST,
            )
        }
        //update nonce();
        user.nonce = uuid()
        await user.save()
        let createdUserMeeting: UserMeeting
        try {
            createdUserMeeting = await this.userMeetingRepoisitory.create({
                userId: user.id,
                meetingId: meetingId,
                status: UserMeetingStatusEnum.DOING,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            await createdUserMeeting.save()
            const currentTime = Date.now()
            const meeting = await this.meetingRepository.findOne({
                where: {
                    id: meetingId,
                },
            })
            if (currentTime > meeting.endTime.getTime()) {
                createdUserMeeting.status = UserMeetingStatusEnum.DONE
            }
            await createdUserMeeting.save()
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
        return createdUserMeeting
    }
}
