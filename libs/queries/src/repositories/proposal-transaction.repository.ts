import { CustomRepository } from '@shares/decorators'
import { Repository } from 'typeorm'
import { ProposalTransaction } from '@entities/proposal-transaction.entity'
import { ResultVoteProposalDto } from '@dtos/proposal.dto'

@CustomRepository(ProposalTransaction)
export class ProposalTransactionRepository extends Repository<ProposalTransaction> {
    async createProposalTransaction(
        resultVoteProposalDto: ResultVoteProposalDto,
    ): Promise<ProposalTransaction> {
        const {
            proposalId,
            notVoteYetQuantity,
            votedQuantity,
            unVotedQuantity,
            transactionId,
        } = resultVoteProposalDto

        const createProposalTransaction = await this.create({
            proposalId,
            transactionId,
            votedQuantity,
            unVotedQuantity,
            notVoteYetQuantity,
        })
        return await createProposalTransaction.save()
    }
}
