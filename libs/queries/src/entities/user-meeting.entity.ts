import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { User } from '@entities/user.entity'
import { Role } from '@entities/role.entity'
import { Meeting } from '@entities/meeting.entity'
import {
    MeetingRole,
    UserMeetingStatusEnum,
} from '@shares/constants/meeting.const'

@Entity('user_meetings')
export class UserMeeting extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false, name: 'user_id', type: 'integer', width: 11 })
    userId: number

    @Column({ nullable: false, name: 'meeting_id', type: 'integer', width: 11 })
    meetingId: number

    @Column({
        name: 'status',
        type: 'enum',
        enum: UserMeetingStatusEnum,
        nullable: false,
        default: UserMeetingStatusEnum.ABSENCE,
    })
    status: UserMeetingStatusEnum

    @Column({
        name: 'role',
        type: 'enum',
        enum: MeetingRole,
        nullable: false,
    })
    role: MeetingRole

    @ManyToOne(() => User)
    @JoinColumn({
        name: 'user_id',
    })
    user: User

    @ManyToOne(() => Role)
    @JoinColumn({
        name: 'meeting_id',
    })
    meeting: Meeting

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date
}
