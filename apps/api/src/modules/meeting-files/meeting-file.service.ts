import { CreateMeetingFileDto } from '@dtos/meeting-file.dto'
import { MeetingFile } from '@entities/meeting-file'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { MeetingFileRepository } from '@repositories/meeting-file.repository'
import { httpErrors } from '@shares/exception-filter'
import { MeetingRepository } from '@repositories/meeting.repository'

@Injectable()
export class MeetingFileService {
    constructor(
        private readonly meetingFileRepository: MeetingFileRepository,
        private readonly meetingRepository: MeetingRepository,
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

    async deleteMeetingFile(
        userId: number,
        companyId: number,
        meetingFileId: number,
    ) {
        // check existed of meeting and meetingFile

        const meetingFile = await this.meetingFileRepository.getMeetingFileById(
            meetingFileId,
        )

        if (!meetingFile) {
            throw new HttpException(
                httpErrors.MEETING_FILE_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            )
        }
        if (meetingFile.meeting.companyId !== companyId) {
            throw new HttpException(
                httpErrors.MEETING_NOT_IN_THIS_COMPANY,
                HttpStatus.BAD_REQUEST,
            )
        }
        try {
            //delete meeting-file
            const meetingId = meetingFile.meeting.id
            await this.meetingFileRepository.softDelete({
                meetingId,
                id: meetingFileId,
            })
            return `meeting-file with Id ${meetingFileId} deleted successfully`
        } catch (error) {
            throw new HttpException(
                { message: error.message },
                HttpStatus.BAD_REQUEST,
            )
        }
    }
}
