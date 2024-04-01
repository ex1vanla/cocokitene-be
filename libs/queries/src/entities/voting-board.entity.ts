import {
    BaseEntity,
    Column,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm'
import { User } from '@entities/user.entity'

@Entity('voting_boards')
@Unique(['userId', 'votedForUserId'])
export class VotingBoard extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false, name: 'user_id', type: 'integer', width: 11 })
    userId: number

    @Column({
        nullable: true,
        name: 'voted_for_user_id',
        type: 'integer',
        width: 11,
    })
    votedForUserId: number

    // @Column({
    //     nullable: true,
    //     name: 'voted_quantity',
    //     type: 'integer',
    //     width: 11,
    // })
    // votedQuantity: number

    @DeleteDateColumn()
    deletedAt: Date

    @ManyToOne(() => User)
    @JoinColumn({
        name: 'user_id',
    })
    user: User
    @ManyToOne(() => User)
    @JoinColumn({
        name: 'voted_for_user_id',
    })
    votedForUser: User
}
