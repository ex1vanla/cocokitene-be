import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { Sort_By_Field, Sort_By_Order } from '@shares/constants/base.const'
import { MeetingType } from '@shares/constants/meeting.const'

export class GetAllMeetingDto {
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    @ApiProperty({
        example: 1,
    })
    page: number

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    @ApiProperty({
        example: 10,
    })
    limit: number

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false,
        example: 'meeting daily',
    })
    searchQuery?: string

    @IsOptional()
    @IsEnum(Sort_By_Field)
    @ApiProperty({
        required: false,
        example: Sort_By_Field.START_TIME,
        default: Sort_By_Field.START_TIME,
        enum: Sort_By_Field,
    })
    sortField?: Sort_By_Field

    @IsOptional()
    @IsEnum(Sort_By_Order)
    @ApiProperty({
        required: false,
        example: Sort_By_Order.ASC,
        default: Sort_By_Order.ASC,
        enum: Sort_By_Order,
    })
    sortOrder?: Sort_By_Order

    @IsNotEmpty()
    @IsEnum(MeetingType)
    @ApiProperty({
        required: false,
        example: MeetingType.FUTURE,
        default: MeetingType.FUTURE,
        enum: MeetingType,
    })
    type: MeetingType
}

export class CreateMeetingDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Hop ban ve san choi',
        required: true,
    })
    title: string

    @IsNotEmpty()
    startTime: Date

    @IsOptional()
    endTime: Date

    @IsString()
    @IsNotEmpty()
    meetingLink: string

    @IsString()
    @IsNotEmpty()
    meetingReport: string

    @IsString()
    @IsNotEmpty()
    meetingInvitation: string
}

export class IdMeetingDto {
    @IsInt()
    @IsNotEmpty()
    @ApiProperty({
        example: 1,
        required: true,
    })
    meetingId: number
}

export class AttendMeetingDto {
    @IsInt()
    @IsNotEmpty()
    @ApiProperty({
        example: 1,
        required: true,
    })
    meetingId: number
}
