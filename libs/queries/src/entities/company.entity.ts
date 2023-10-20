import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { CompanyStatus } from './company-status.entity'
import { Plan } from './plan.entity'
import { User } from '@entities/user.entity'
import { CompanyTypeBussiness } from '@shares/constants'

@Entity('companys')
export class Company extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        nullable: false,
        name: 'company_name',
        type: 'varchar',
        length: 255,
        unique: true,
    })
    companyName: string

    @Column({
        nullable: true,
        name: 'company_short_name',
        type: 'varchar',
        length: 255,
    })
    companyShortName: string

    @Column({
        name: 'description',
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    description: string

    @Column({
        nullable: false,
        name: 'company_address',
        type: 'varchar',
        length: 255,
    })
    address: string

    @Column({ nullable: false, name: 'plan_id', type: 'integer', width: 11 })
    planId: number

    @Column({ nullable: false, name: 'status_id', type: 'integer', width: 11 })
    statusId: number

    @Column({
        nullable: true,
        name: 'company_phone',
        type: 'varchar',
        length: 255,
    })
    phone: string

    @Column({
        nullable: true,
        name: 'company_tax_number',
        type: 'varchar',
        length: 255,
    })
    taxNumber: string

    @Column({
        name: 'company_email',
        type: 'varchar',
        length: 255,
        unique: true,
        nullable: false,
    })
    email: string

    @Column({
        name: 'company_fax',
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    fax: string

    @Column({
        nullable: false,
        name: 'representative_id',
        type: 'integer',
        width: 11,
    })
    representativeId: number

    @CreateDateColumn({ name: 'date_of_incorporation' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date

    @Column({
        nullable: true,
        name: 'company_logo',
        type: 'varchar',
        length: 255,
    })
    logo: string

    @Column({
        nullable: false,
        name: 'company_size',
        type: 'integer',
        width: 11,
        default: 0,
    })
    companySize: number

    @Column({
        nullable: false,
        type: 'enum',
        name: 'bussiness_type',
        enum: CompanyTypeBussiness,
    })
    bussinessType: CompanyTypeBussiness

    @ManyToOne(() => CompanyStatus)
    @JoinColumn({
        name: 'status_id',
    })
    companyStatus: CompanyStatus

    @ManyToOne(() => Plan)
    @JoinColumn({
        name: 'plan_id',
    })
    plan: Plan
    @OneToOne(() => User)
    @JoinColumn({
        name: 'representative_id',
    })
    representative: User
}
