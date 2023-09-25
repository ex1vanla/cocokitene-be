import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { Company } from '@entities/company.entity'
import { User } from '@entities/user.entity'
import { MeetingFile } from '@entities/meeting-file'
@Entity('meetings')
export class Meeting extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'title', type: 'varchar', length: 255, nullable: true })
    title: string

    @Column({
        type: 'datetime',
        nullable: true,
        name: 'start_time',
    })
    startTime: string

    @Column({
        type: 'datetime',
        nullable: true,
        name: 'end_time',
    })
    endTime: string

    @Column({
        nullable: true,
        name: 'meeting_link',
        type: 'varchar',
        length: 255,
    })
    meetingLink: string

    @Column({ nullable: false, name: 'company_id', type: 'integer', width: 11 })
    companyId: number

    @Column({ nullable: false, name: 'creator_id', type: 'integer', width: 11 })
    creatorId: number

    @ManyToOne(() => Company)
    @JoinColumn({
        name: 'company_id',
    })
    company: Company

    @ManyToOne(() => User)
    @JoinColumn({
        name: 'creator_id',
    })
    creator: User

    @OneToMany(() => MeetingFile, (meetingFile) => meetingFile.meeting)
    meetingFiles: MeetingFile[]
}
