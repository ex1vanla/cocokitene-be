import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm'
import { User } from '@entities/user.entity'
import { Candidate } from './board-members.entity'
import { VoteProposalResult } from '@shares/constants/proposal.const'

@Entity('voting_board_members')
@Unique(['userId', 'votedForCandidateId'])
export class VotingCandidate extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false, name: 'user_id', type: 'integer', width: 11 })
    userId: number

    @Column({
        nullable: false,
        name: 'board_member_id',
        type: 'integer',
        width: 11,
    })
    votedForCandidateId: number

    @Column({
        name: 'result',
        type: 'enum',
        nullable: false,
        enum: VoteProposalResult,
    })
    result: VoteProposalResult

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    @ManyToOne(() => User)
    @JoinColumn({
        name: 'user_id',
    })
    user: User

    @ManyToOne(() => Candidate)
    @JoinColumn({
        name: 'voted_for_candidate_id',
    })
    votedForCandidate: Candidate
}
