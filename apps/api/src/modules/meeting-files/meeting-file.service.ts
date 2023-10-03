import { CreateMeetingFileDto } from '@dtos/meeting-file.dto'
import { MeetingFile } from '@entities/meeting-file'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { MeetingFileRepository } from '@repositories/meeting-file.repository'
import { httpErrors } from '@shares/exception-filter'

@Injectable()
export class MeetingFileService {
    constructor(
        private readonly meetingFileRepository: MeetingFileRepository,
    ) {}

    async createMeetingFile(
        createMeetingFileDto: CreateMeetingFileDto,
    ): Promise<MeetingFile> {
        const { url, meetingId, fileType } = createMeetingFileDto
        try {
            const createdMeetingFile =
                await this.meetingFileRepository.createMeetingFile({
                    url,
                    meetingId,
                    fileType,
                })
            await createdMeetingFile.save()
            return createdMeetingFile
        } catch (error) {
            throw new HttpException(
                httpErrors.MEETING_FILE_CREATE_FAILED,
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }
}
