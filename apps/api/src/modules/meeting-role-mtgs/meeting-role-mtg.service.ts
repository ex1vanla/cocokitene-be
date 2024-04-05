import { Injectable } from '@nestjs/common'
import { MeetingRoleMtgRepository } from '@repositories/meeting-role-mtg.repository'

@Injectable()
export class MeetingRoleMtgService {
    constructor(
        private readonly meetingRoleMtgRepository: MeetingRoleMtgRepository,
    ) {}
}
