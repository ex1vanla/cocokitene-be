import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { Meeting } from '@entities/meeting.entity'
import { User } from '@entities/user.entity'
import { ElectionEnum } from '@shares/constants'

@Entity('user_vote_participants')
export class UserVoteParticipant extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number
    @Column({ nullable: false, name: 'user_id', type: 'integer', width: 11 })
    userId: number

    @Column({
        nullable: false,
        type: 'enum',
        name: 'type',
        enum: ElectionEnum,
    })
    type: ElectionEnum

    @Column({
        nullable: true,
        name: 'voted_quantity',
        type: 'integer',
        width: 11,
    })
    votedQuantity: number

    @Column({
        nullable: true,
        name: 'un_voted_quantity',
        type: 'integer',
        width: 11,
    })
    unVotedQuantity: number

    @Column({ nullable: false, name: 'meeting_id', type: 'integer', width: 11 })
    meetingId: number

    @ManyToOne(() => Meeting)
    @JoinColumn({
        name: 'meeting_id',
    })
    meeting: Meeting

    @ManyToOne(() => User)
    @JoinColumn({
        name: 'creator_id',
    })
    user: User
}
