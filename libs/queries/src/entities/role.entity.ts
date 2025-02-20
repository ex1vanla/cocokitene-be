import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { Company } from '@entities/company.entity'
import { RolePermission } from './role-permission.entity'
import { UserRole } from '@entities/user-role.entity'

@Entity('role')
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        name: 'role',
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    roleName: string

    @Column({
        name: 'description',
        type: 'varchar',
        length: 1000,
        nullable: true,
    })
    description: string

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

    @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
    rolePermissions: RolePermission[]

    @OneToMany(() => UserRole, (userRole) => userRole.role)
    userRole: UserRole[]
}
