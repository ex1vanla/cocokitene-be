import {
    CreateMeetingFileDto,
    TypeMeetingFileDto,
} from '@dtos/meeting-file.dto'
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
        typeMeetingFileDto: TypeMeetingFileDto,
    ) {
        const { type } = typeMeetingFileDto
        // check existed of meeting and meetingFile

        const meetingId =
            await this.meetingFileRepository.getIdMeetingByMeetingFileId(
                meetingFileId,
            )
        const meeting = await this.meetingRepository.findOne({
            where: {
                id: meetingId,
            },
        })
        if (!meeting) {
            throw new HttpException(
                httpErrors.MEETING_NOT_EXISTED,
                HttpStatus.BAD_REQUEST,
            )
        }
        if (meeting.companyId !== companyId) {
            throw new HttpException(
                httpErrors.MEETING_NOT_IN_THIS_COMPANY,
                HttpStatus.BAD_REQUEST,
            )
        }
        try {
            //delete meeting-file
            await this.meetingFileRepository.softDelete({
                meetingId,
                id: meetingFileId,
                fileType: type,
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
