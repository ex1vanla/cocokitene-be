import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm'
import { Company } from '@entities/company.entity'
import { MeetingRoleMtg } from '@entities/meeting-role-relations.entity'
import { UserMeeting } from '@entities/meeting-participant.entity'
import { TypeRoleMeeting } from '@shares/constants'

@Entity('meeting_role')
@Unique(['roleName', 'companyId'])
export class RoleMtg extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        name: 'role',
        type: 'varchar',
        length: 255,
        nullable: false,
        // unique: true,
    })
    roleName: string

    @Column({
        name: 'description',
        type: 'varchar',
        length: 1000,
        nullable: true,
    })
    description: string

    @Column({
        nullable: false,
        name: 'type',
        type: 'enum',
        enum: TypeRoleMeeting,
    })
    type: TypeRoleMeeting

    @Column({ nullable: false, name: 'company_id', type: 'integer', width: 11 })
    companyId: number

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date

    @ManyToOne(() => Company)
    @JoinColumn({
        name: 'company_id',
    })
    company: Company

    @OneToMany(() => MeetingRoleMtg, (meetingRoleMtg) => meetingRoleMtg.roleMtg)
    meetingRoleMtg: MeetingRoleMtg[]

    @OneToMany(() => UserMeeting, (userMeeting) => userMeeting.roleMtg)
    userMeetings: UserMeeting[]
}
