import { ApiProperty } from '@nestjs/swagger'
import {
    MeetingRole,
    UserMeetingStatusEnum,
} from '@shares/constants/meeting.const'
import { IsEnum, IsNumber, IsOptional } from 'class-validator'

export class CreateUserMeetingDto {
    @IsNumber()
    @ApiProperty({
        required: true,
        example: 1,
    })
    userId: number

    @IsNumber()
    @ApiProperty({
        required: true,
        example: 1,
    })
    meetingId: number

    @IsEnum(MeetingRole)
    @ApiProperty({
        required: true,
        enum: MeetingRole,
    })
    role: MeetingRole

    @IsOptional()
    @IsEnum(MeetingRole)
    @ApiProperty({
        required: false,
        enum: MeetingRole,
    })
    status?: UserMeetingStatusEnum
}
