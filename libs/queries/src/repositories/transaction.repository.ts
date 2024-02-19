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

    async gettransactionsCreateMeetingSuccessful(): Promise<Transaction[]> {
        const meetingIds = await this.createQueryBuilder('transaction')
            .select('DISTINCT transaction.meetingId', 'meetingId')
            .where('transaction.type = :type', {
                type: TRANSACTION_TYPE.CREATE_MEETING,
            })
            .andWhere('transaction.status = :status', {
                status: TRANSACTION_STATUS.SUCCESS,
            })
            .andWhere(
                'NOT EXISTS (SELECT 1 FROM transactions t WHERE t.meetingId = transaction.meetingId AND t.type IN (:...types))',
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
}
