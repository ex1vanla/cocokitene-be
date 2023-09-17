import { ApiProperty } from '@nestjs/swagger'
import { MeetingFileType } from '@shares/constants/meeting.const'
import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'

export class MeetingFile {
    fileName: string
    fileType: MeetingFileType
}

export class GetPresignedUrlDto {
    @ApiProperty({
        required: true,
        isArray: true,
        type: [MeetingFile],
    })
    @ValidateNested()
    @Type(() => MeetingFile)
    meetingFiles: MeetingFile[]
}
