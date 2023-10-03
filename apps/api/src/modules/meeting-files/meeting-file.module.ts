import { MeetingFileService } from '@api/modules/meeting-files/meeting-file.service'
import { Module } from '@nestjs/common'

@Module({
    providers: [MeetingFileService],
    exports: [MeetingFileService],
})
export class MeetingFileModule {}
