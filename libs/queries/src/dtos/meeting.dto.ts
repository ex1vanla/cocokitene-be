import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

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
    @ApiProperty({
        required: false,
        example: 'startTime',
        enum: ['startTime', 'endTime'],
    })
    sortField?: string = 'startTime'

    @IsOptional()
    @ApiProperty({
        required: false,
        example: 'ASC',
        enum: ['ASC', 'DESC'],
    })
    sortOrder?: 'ASC' | 'DESC' = 'ASC'
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
