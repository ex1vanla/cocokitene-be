import { Repository } from 'typeorm'
import { Transaction } from '@entities/transaction.entity'
import { CustomRepository } from '@shares/decorators'
import { CreateTransactionDto } from '@dtos/transaction.dto'
import { TRANSACTION_STATUS, TRANSACTION_TYPE } from '@shares/constants'

@CustomRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {
    async createTransaction(
        createTransactionDto: CreateTransactionDto,
    ): Promise<Transaction> {
        const {
            chainId,
            companyId,
            titleMeeting,
            joinedMeetingShares,
            shareholdersJoined,
            shareholdersTotal,
            totalMeetingShares,
            meetingId,
            meetingLink,
            startTimeMeeting,
            endTimeMeeting,
            contractAddress,
            type,
        } = createTransactionDto

        const createTransaction = await this.create({
            chainId,
            companyId,
            titleMeeting,
            joinedMeetingShares,
            shareholdersJoined,
            shareholdersTotal,
            totalMeetingShares,
            meetingId,
            meetingLink,
            startTimeMeeting,
            endTimeMeeting,
            type,
            contractAddress,
        })
        return await createTransaction.save()
    }
    async getMeetingIdsWithTransactions(): Promise<number[]> {
        const transactions = await this.createQueryBuilder('transactions')
            .select(['transactions.meetingId'])
            .getMany()
        const meetingIds = transactions.map(
            (transaction) => transaction.meetingId,
        )
        return meetingIds
    }

    async getTransactionsCreateMeetingSuccessful(): Promise<Transaction[]> {
        const meetingIds = await this.createQueryBuilder('transactions')
            .select([
                'transactions.meetingId',
                'transactions.companyId',
                'transactions.contractAddress',
                'transactions.meetingLink',
                'transactions.titleMeeting',
                'transactions.startTimeMeeting',
                'transactions.endTimeMeeting',
                'transactions.shareholdersTotal',
                'transactions.shareholdersJoined',
                'transactions.joinedMeetingShares',
                'transactions.totalMeetingShares',
                'transactions.status',
                'transactions.type',
            ])
            .where('transactions.type = :type', {
                type: TRANSACTION_TYPE.CREATE_MEETING,
            })
            .andWhere('transactions.status = :status', {
                status: TRANSACTION_STATUS.SUCCESS,
            })
            .andWhere(
                'NOT EXISTS (SELECT 1 FROM transactions AS t  WHERE t.meeting_id = transactions.meetingId AND t.type IN (:...types))',
                {
                    types: [
                        TRANSACTION_TYPE.UPDATE_PROPOSAL_MEETING,
                        TRANSACTION_TYPE.UPDATE_USER_PARTICIPATE_MEETING,
                        TRANSACTION_TYPE.UPDATE_FILE_PROPOSAL_MEETING,
                    ],
                },
            )
            .getRawMany()
        return meetingIds
    }

    async findTransactionByStatus(
        transactionStatus: TRANSACTION_STATUS,
    ): Promise<Transaction[]> {
        const transactions = await this.find({
            where: {
                status: transactionStatus,
            },
        })
        return transactions
    }

    async updateTransaction(
        id: number,
        updateOptions: Partial<Transaction>,
    ): Promise<void> {
        await this.createQueryBuilder('transactions')
            .update(Transaction)
            .set(updateOptions)
            .where('transactions.id = :id', { id })
            .execute()
    }

    async updateTransactionByMeetingId(
        meetingId: number,
        updateOptions: Partial<Transaction>,
    ) {
        await this.createQueryBuilder('transactions')
            .update(Transaction)
            .set(updateOptions)
            .where('transactions.meeting_id = :meetingId', { meetingId })
            .execute()
    }
}
