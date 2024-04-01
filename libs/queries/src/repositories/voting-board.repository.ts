import { Repository } from 'typeorm'
import { VotingBoard } from '@entities/voting-board.entity'
import { CustomRepository } from '@shares/decorators'

@CustomRepository(VotingBoard)
export class VotingBoardRepository extends Repository<VotingBoard> {}
