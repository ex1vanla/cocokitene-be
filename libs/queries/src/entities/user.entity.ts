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
import { UserStatus } from '@entities/user-status.entity'
import { Role } from '@entities/role.entity'
import { Company } from '@entities/company.entity'

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'username', type: 'varchar', length: 255, nullable: true })
    username: string

    @Column({ name: 'email', type: 'varchar', length: 255, nullable: true })
    email: string

    @Column({
        name: 'wallet_address',
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    walletAddress: string

    @Column({ name: 'avartar', type: 'varchar', length: 255, nullable: true })
    avatar: string

    @Column({ nullable: false, name: 'role_id', type: 'integer', width: 11 })
    roleId: number

    @Column({ nullable: false, name: 'status_id', type: 'integer', width: 11 })
    statusId: number

    @Column({ nullable: true, name: 'company_id', type: 'integer', width: 11 })
    companyId: number

    @Column({
        nullable: true,
        type: 'varchar',
        length: 50,
    })
    nonce: string

    @Column({
        nullable: true,
        type: 'varchar',
        length: 50,
    })
    defaultAvatarHashColor: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date

    @ManyToOne(() => Role)
    @JoinColumn({
        name: 'role_id',
    })
    role: Role

    @ManyToOne(() => UserStatus)
    @JoinColumn({
        name: 'status_id',
    })
    userStatus: UserStatus

    @ManyToOne(() => Company)
    @JoinColumn({
        name: 'company_id',
    })
    company: Company

    @Column({
        nullable: true,
        name: 'phone_number',
        type: 'varchar',
        length: 255,
    })
    phone: string

    @Column({
        nullable: true,
        name: 'active_time',
    })
    activeTime: Date
}
