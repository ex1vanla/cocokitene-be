import { Repository } from 'typeorm'
import { MeetingRoleMtg } from '@entities/meeting-role-mtg.entity'
import { CustomRepository } from '@shares/decorators'
@CustomRepository(MeetingRoleMtg)
export class MeetingRoleMtgRepository extends Repository<MeetingRoleMtg> {}
