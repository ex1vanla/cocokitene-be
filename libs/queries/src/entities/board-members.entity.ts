import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { Meeting } from '@entities/meeting.entity'
import { User } from '@entities/user.entity'
import { Election } from './election.entity'

@Entity('board_members')
export class Candidate extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        name: 'title',
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    title: string

    @Column({
        nullable: false,
        name: 'name',
        type: 'varchar',
        length: 255,
    })
    candidateName: string

    @Column({
        nullable: false,
        name: 'type',
        type: 'integer',
        width: 11,
    })
    type: number

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

    @Column({ nullable: false, name: 'meeting_id', type: 'integer', width: 11 })
    meetingId: number

    @ManyToOne(() => Election)
    @JoinColumn({
        name: 'type',
    })
    typeElection: Election

    @ManyToOne(() => Meeting)
    @JoinColumn({
        name: 'meeting_id',
    })
    meeting: Meeting

    @Column({ nullable: false, name: 'creator_id', type: 'integer', width: 11 })
    creatorId: number

    @ManyToOne(() => User)
    @JoinColumn({
        name: 'creator_id',
    })
    creator: User

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
