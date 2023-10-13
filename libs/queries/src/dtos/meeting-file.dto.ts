import { ApiProperty, OmitType } from '@nestjs/swagger'
import { MeetingFileType } from '@shares/constants/meeting.const'
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateMeetingFileDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        required: true,
        example: 'https://www.africau.edu/images/default/sample.pdf',
    })
    url: string

    @IsNumber()
    @ApiProperty({
        required: true,
        example: 1,
    })
    meetingId: number

    @IsEnum(MeetingFileType)
    @ApiProperty({
        required: true,
        enum: MeetingFileType,
    })
    fileType: MeetingFileType
}

export class TypeMeetingFileDto {
    @IsEnum(MeetingFileType)
    @ApiProperty({
        required: true,
        enum: MeetingFileType,
    })
    type: MeetingFileType
}

export class MeetingFileDto extends OmitType(CreateMeetingFileDto, [
    'meetingId',
]) {}
