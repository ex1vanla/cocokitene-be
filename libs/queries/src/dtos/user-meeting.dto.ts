import { ApiProperty, OmitType } from '@nestjs/swagger'
import {
    MeetingRole,
    UserMeetingStatusEnum,
} from '@shares/constants/meeting.const'
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator'

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

    // @IsEnum(MeetingRole)
    // @ApiProperty({
    //     required: true,
    //     enum: MeetingRole,
    // })
    // role: MeetingRole

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        example: 'ADMIN',
    })
    role: string

    @IsOptional()
    @IsEnum(MeetingRole)
    @ApiProperty({
        required: false,
        enum: MeetingRole,
    })
    status?: UserMeetingStatusEnum
}

export class ParticipantDto extends OmitType(CreateUserMeetingDto, [
    'meetingId',
    'role',
]) {
    @IsEnum(MeetingRole)
    @ApiProperty({
        required: true,
        enum: MeetingRole,
    })
    role: MeetingRole

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: true,
        example: 'leopaul',
    })
    username: string

    @IsNumber()
    @ApiProperty({
        required: true,
        example: 1,
    })
    transactionId: number
}
