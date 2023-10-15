import { MeetingFile } from '@entities/meeting-file'
import { CustomRepository } from '@shares/decorators'
import { Repository } from 'typeorm'
import { CreateMeetingFileDto } from '../dtos'

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

    async getMeetingFileById(meetingFileId: number): Promise<MeetingFile> {
        const meetingFile = await this.findOne({
            where: {
                id: meetingFileId,
            },
            relations: ['meeting'],
        })
        return meetingFile
    }
}
