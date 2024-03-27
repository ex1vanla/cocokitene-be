import { Repository } from 'typeorm'
import { UserVoteParticipant } from '@entities/user-vote-participant.entity'
import { CustomRepository } from '@shares/decorators'
@CustomRepository(UserVoteParticipant)
export class UserVoteParticipantRepository extends Repository<UserVoteParticipant> {}
