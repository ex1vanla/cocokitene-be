import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'

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

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '0x9b500a4B354914d420c3D1497AEe4Ba9d45b7Df0',
    })
    @Transform(({ value }) => {
        return value?.toLowerCase()
    })
    walletAddress: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example:
            '0x7558dbb143dc091343a3f8244e815132a14243a4dae899a02b23716da839945f7e436876882f59a30c5a768c32fb512f68232626fc81d6f0053ebcda3de90d191b',
    })
    signature: string
}
