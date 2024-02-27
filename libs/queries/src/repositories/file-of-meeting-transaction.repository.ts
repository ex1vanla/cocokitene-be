import { Repository } from 'typeorm'
import { FileOfMeetingTransaction } from '@entities/file-of-meeting-transaction.entity'
import { CustomRepository } from '@shares/decorators'
import { CreateFileOfMeetingTransactionDto } from '@dtos/meeting-file.dto'

@CustomRepository(FileOfMeetingTransaction)
export class FileOfMeetingTransactionRepository extends Repository<FileOfMeetingTransaction> {
    async createFileOfMeetingTransaction(
        createFileOfMeetingTransactionDto: CreateFileOfMeetingTransactionDto,
    ): Promise<FileOfMeetingTransaction> {
        const { url, meetingFileId, meetingId } =
            createFileOfMeetingTransactionDto

        const createFileOfMeetingTransaction = await this.create({
            url,
            meetingFileId,
            meetingId,
        })
        return await createFileOfMeetingTransaction.save()
    }

    async getFileOfMeetingTransactionsByMeetingId(
        meetingId: number,
    ): Promise<FileOfMeetingTransaction[]> {
        const fileOfMeetingTransactions = await this.find({
            where: {
                meetingId: meetingId,
            },
        })
        return fileOfMeetingTransactions
    }
}
