import { Injectable } from '@nestjs/common'
import { MeetingRoleMtgRepository } from '@repositories/meeting-role-mtg.repository'
import { CreateMeetingRoleMtgDto } from '@dtos/meeting-role-mtg.dto'
import { MeetingRoleMtg } from '@entities/meeting-role-mtg.entity'

@Injectable()
export class MeetingRoleMtgService {
    constructor(
        private readonly meetingRoleMtgRepository: MeetingRoleMtgRepository,
    ) {}

    async getRoleMtgIdsByMeetingId(meetingId: number): Promise<number[]> {
        const meetingRoleMtgs =
            await this.meetingRoleMtgRepository.getRoleMtgsByMeetingId(
                meetingId,
            )
        const roleMeetingIds = meetingRoleMtgs.map(
            (meetingRoleMtg) => meetingRoleMtg.roleMtgId,
        )
        return roleMeetingIds
    }

    async createMeetingRoleMtg(
        createMeetingRoleMtgDto: CreateMeetingRoleMtgDto,
    ): Promise<MeetingRoleMtg> {
        const createdMeetingRoleMtg =
            await this.meetingRoleMtgRepository.createMeetingRoleMtg(
                createMeetingRoleMtgDto,
            )
        return createdMeetingRoleMtg
    }
}
