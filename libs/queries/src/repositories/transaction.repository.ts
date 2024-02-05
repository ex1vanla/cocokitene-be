import { Repository } from 'typeorm'
import { Transaction } from '@entities/transaction.entity'
import { CustomRepository } from '@shares/decorators'
import { CreateTransactionDto } from '@dtos/transaction.dto'

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
}
