import { CustomRepository } from '@shares/decorators'
import { Repository } from 'typeorm'
import { FileOfProposalTransaction } from '@entities/file-of-proposal-transaction.entity'
import { FileOfProposalDto } from '@dtos/proposal-file.dto'

@CustomRepository(FileOfProposalTransaction)
export class FileOfProposalTransactionRepository extends Repository<FileOfProposalTransaction> {
    async createFileOfProposalTransaction(
        fileOfProposalDto: FileOfProposalDto,
    ): Promise<FileOfProposalTransaction> {
        const { url, proposalFileId, meetingId } = fileOfProposalDto

        const createFileOfProposalTransaction = await this.create({
            url,
            proposalFileId,
            meetingId,
        })
        return await createFileOfProposalTransaction.save()
    }
}
