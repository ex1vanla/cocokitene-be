import { Repository } from 'typeorm'
import { Transaction } from '@entities/transaction.entity'
import { CustomRepository } from '@shares/decorators'
@CustomRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {}
