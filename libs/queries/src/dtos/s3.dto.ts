import { ApiProperty } from '@nestjs/swagger'
import { FileTypes } from '@shares/constants/meeting.const'
import { Type } from 'class-transformer'
import { IsEnum, IsString, ValidateNested } from 'class-validator'

export class MeetingFile {
    @ApiProperty()
    @IsString()
    fileName: string

    @ApiProperty({ example: FileTypes.MEETING_INVITATION })
    @IsEnum(FileTypes)
    fileType: FileTypes
}

export class GetPresignedUrlDto {
    @ApiProperty({
        required: true,
        // isArray: true,
        type: [MeetingFile],
        example: [
            {
                fileName: '',
                fileType: FileTypes.MEETING_INVITATION,
            },
        ],
    })
    @ValidateNested()
    @Type(() => MeetingFile)
    meetingFiles: MeetingFile[]
}
