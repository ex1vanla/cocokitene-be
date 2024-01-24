import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { TRANSACTION_STATUS } from '@shares/constants/transaction.const'

@Entity('transactions')
export class Transaction extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        name: 'chain_id',
        nullable: false,
        type: 'integer',
        width: 11,
    })
    chainId: number

    @Column({
        name: 'contract_address',
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    contractAddress: string

    @Column({
        name: 'meeting_id',
        type: 'integer',
        width: 11,
        nullable: true,
    })
    meetingId: number

    @Column({
        name: 'user_id',
        type: 'integer',
        width: 11,
        nullable: true,
    })
    userId: number

    @Column({
        nullable: false,
        type: 'enum',
        enum: TRANSACTION_STATUS,
        default: TRANSACTION_STATUS.PENDING,
    })
    status: TRANSACTION_STATUS

    @Column({ name: 'tx_hash', type: 'varchar', length: 255, nullable: true })
    txHash: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date
}
