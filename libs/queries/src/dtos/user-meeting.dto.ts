import { ApiProperty } from '@nestjs/swagger'
import { MeetingRole } from '@shares/constants/meeting.const'
import { IsEnum, IsNumber } from 'class-validator'

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
}
