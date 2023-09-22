import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '@entities/user.entity'
import { Meeting } from '@entities/meeting.entity'
@Entity('proposals')
export class Proposal extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        name: 'description',
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    description: string

    @Column({
        nullable: true,
        name: 'type',
        type: 'varchar',
        length: 255,
    })
    type: string

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

    @Column({
        nullable: true,
        name: 'not_vote_yet_quantity',
        type: 'integer',
        width: 11,
    })
    notVoteYetQuantity: number

    @Column({ nullable: false, name: 'creator_id', type: 'integer', width: 11 })
    creatorId: number

    @ManyToOne(() => Meeting)
    @JoinColumn({
        name: 'meeting_id',
    })
    meeting: Meeting

    @ManyToOne(() => User)
    @JoinColumn({
        name: 'creator_id',
    })
    creator: User
}
