import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { Transaction } from '@entities/transaction.entity'
import { Proposal } from '@entities/proposal.entity'
import { ProposalFile } from '@entities/proposal-file'

@Entity('file_of_proposal_transactions')
export class FileOfProposalTransaction extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        nullable: false,
        name: 'proposal_file_id',
        type: 'integer',
        width: 11,
    })
    proposalFileId: number

    @Column({
        nullable: false,
        name: 'transaction_id',
        type: 'integer',
        width: 11,
    })
    transactionId: number

    @Column({
        nullable: false,
        name: 'proposal_id',
        type: 'integer',
        width: 11,
    })
    proposalId: number

    @Column({ nullable: false, name: 'url', type: 'varchar', length: 255 })
    url: string

    @ManyToOne(() => Transaction, (transaction) => transaction.fileOfProposals)
    @JoinColumn({ name: 'transaction_id' })
    transaction: Transaction

    @ManyToOne(() => Proposal)
    @JoinColumn({
        name: 'proposal_id',
    })
    proposal: Proposal

    @OneToOne(() => ProposalFile)
    @JoinColumn({
        name: 'proposal_file_id',
    })
    proposalFile: ProposalFile

    @DeleteDateColumn()
    deletedAt: Date

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date
}
