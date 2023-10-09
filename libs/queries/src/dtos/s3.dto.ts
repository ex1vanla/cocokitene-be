import { ApiProperty } from '@nestjs/swagger'
import { MeetingFileType } from '@shares/constants/meeting.const'
import { Type } from 'class-transformer'
import { IsEnum, IsString, ValidateNested } from 'class-validator'

export class MeetingFile {
    @ApiProperty()
    @IsString()
    fileName: string

    @ApiProperty({ example: MeetingFileType.MEETING_INVITATION })
    @IsEnum(MeetingFileType)
    fileType: MeetingFileType
}

export class GetPresignedUrlDto {
    @ApiProperty({
        required: true,
        // isArray: true,
        type: [MeetingFile],
        example: [
            {
                fileName: '',
                fileType: MeetingFileType.MEETING_INVITATION,
            },
        ],
    })
    @ValidateNested()
    @Type(() => MeetingFile)
    meetingFiles: MeetingFile[]
}
