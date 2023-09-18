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
import { Role } from '@entities/role.entity'
import { Permission } from '@entities/permission.entity'

@Entity('role_permissions')
export class RolePermission extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false, name: 'role_id', type: 'integer', width: 11 })
    roleId: number

    @Column({
        nullable: false,
        name: 'permission_id',
        type: 'integer',
        width: 11,
    })
    permissionId: number

    @ManyToOne(() => Role)
    @JoinColumn({
        name: 'role_id',
    })
    role: Role

    @ManyToOne(() => Permission)
    @JoinColumn({
        name: 'permission_id',
    })
    permission: Permission
    @Column({
        name: 'description',
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    description: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date
}
