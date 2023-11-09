import { CreateProposalFileDto } from '@dtos/proposal-file.dto'
import { ProposalFile } from '@entities/proposal-file'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ProposalFileRepository } from '@repositories/proposal-file.repository'
import { httpErrors } from '@shares/exception-filter'

@Injectable()
export class ProposalFileService {
    constructor(
        private readonly proposalFileRepository: ProposalFileRepository, // @Inject(forwardRef(() => MeetingService)) // private readonly meetingService: MeetingService,
    ) {}

    async createProposalFile(
        createProposalFileDto: CreateProposalFileDto,
    ): Promise<ProposalFile> {
        const { url, proposalId } = createProposalFileDto
        try {
            const createdProposalFile =
                await this.proposalFileRepository.createProposalFile({
                    url,
                    proposalId,
                })
            return createdProposalFile
        } catch (error) {
            throw new HttpException(
                httpErrors.PROPOSAL_FILE_CREATE_FAILED,
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    // async updateListMeetingFiles(
    //     meetingId: number,
    //     meetingFiles: MeetingFileDto[],
    // ): Promise<void> {
    //     const meeting = await this.meetingService.getInternalMeetingById(
    //         meetingId,
    //     )
    //     const listCurrentMeetingFiles = meeting.meetingFiles
    //     // list edited
    //     const listEdited = meetingFiles.filter((file) => !!file.id)
    //     const listEditedIds = listEdited.map((file) => file.id)
    //     // list deleted
    //     const listDeleted = listCurrentMeetingFiles.filter(
    //         (file) => !listEditedIds.includes(file.id),
    //     )
    //     // list added
    //     const listAdded = meetingFiles.filter((file) => !file.id)

    //     try {
    //         await Promise.all([
    //             ...listEdited.map((file) =>
    //                 this.meetingFileRepository.updateMeetingFile(file.id, file),
    //             ),
    //             ...listDeleted.map((file) =>
    //                 this.meetingFileRepository.deleteMeetingFile(file.id),
    //             ),
    //             ...listAdded.map((file) =>
    //                 this.meetingFileRepository.createMeetingFile({
    //                     ...file,
    //                     meetingId,
    //                 }),
    //             ),
    //         ])
    //     } catch (error) {
    //         throw new HttpException(
    //             { message: error.message },
    //             HttpStatus.BAD_REQUEST,
    //         )
    //     }
    // }
}
