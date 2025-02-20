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
import { Meeting } from '@entities/meeting.entity'
import { RoleMtg } from '@entities/meeting-role.entity'

@Entity('meeting_role_relations')
export class MeetingRoleMtg extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false, name: 'meeting_id', type: 'integer', width: 11 })
    meetingId: number

    @Column({
        nullable: false,
        name: 'role_mtg_id',
        type: 'integer',
        width: 11,
    })
    roleMtgId: number

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date

    @ManyToOne(() => Meeting, (meeting) => meeting.meetingRoleMtg)
    @JoinColumn({
        name: 'meeting_id',
    })
    meeting: Meeting

    @ManyToOne(() => RoleMtg, (roleMtg) => roleMtg.meetingRoleMtg)
    @JoinColumn({
        name: 'role_mtg_id',
    })
    roleMtg: RoleMtg
}
