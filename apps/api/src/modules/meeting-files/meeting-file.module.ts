import { MeetingFileService } from '@api/modules/meeting-files/meeting-file.service'
import { Module } from '@nestjs/common'
import { MeetingFileController } from '@api/modules/meeting-files/meeting-file.controller'

@Module({
    controllers: [MeetingFileController],
    providers: [MeetingFileService],
    exports: [MeetingFileService],
})
export class MeetingFileModule {}
