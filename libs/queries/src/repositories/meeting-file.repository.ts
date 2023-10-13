import { MeetingFile } from '@entities/meeting-file'
import { CustomRepository } from '@shares/decorators'
import { Repository } from 'typeorm'
import { CreateMeetingFileDto } from '../dtos'
import { HttpException, HttpStatus } from '@nestjs/common'
import { httpErrors } from '@shares/exception-filter'

@CustomRepository(MeetingFile)
export class MeetingFileRepository extends Repository<MeetingFile> {
    async createMeetingFile(
        createMeetingFileDto: CreateMeetingFileDto,
    ): Promise<MeetingFile> {
        const { url, meetingId, fileType } = createMeetingFileDto
        const createdMeetingFile = await this.create({
            url,
            meetingId,
            fileType,
        })
        await createdMeetingFile.save()
        return createdMeetingFile
    }

    async getIdMeetingByMeetingFileId(meetingFileId: number): Promise<number> {
        const meetingFile = await this.findOne({
            where: {
                id: meetingFileId,
            },
        })
        if (!meetingFile) {
            throw new HttpException(
                httpErrors.MEETING_FILE_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            )
        }
        const meetingId = meetingFile.meetingId
        return meetingId
    }
}
