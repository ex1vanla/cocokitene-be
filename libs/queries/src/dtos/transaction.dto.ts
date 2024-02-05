import { IsNumber, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class CreateTransactionDto {
    @IsNumber()
    @Type(() => Number)
    @ApiProperty({
        required: true,
        example: 1,
    })
    chainId: number

    @IsOptional()
    @IsString()
    @ApiProperty({
        required: false,
        example: 'the meeing about product strategy meeting',
    })
    titleMeeting: string

    @IsNumber()
    @Type(() => Number)
    @ApiProperty({
        required: true,
        example: 1,
    })
    meetingId: number

    @IsNumber()
    @Type(() => Number)
    @ApiProperty({
        required: true,
        example: 1,
    })
    companyId: number

    @IsNumber()
    @Type(() => Number)
    @ApiProperty({
        required: true,
        example: 1,
    })
    shareholdersJoined: number

    @IsNumber()
    @Type(() => Number)
    @ApiProperty({
        required: true,
        example: 1,
    })
    joinedMeetingShares: number

    @IsNumber()
    @Type(() => Number)
    @ApiProperty({
        required: true,
        example: 1,
    })
    totalMeetingShares: number

    @IsNumber()
    @Type(() => Number)
    @ApiProperty({
        required: true,
        example: 1,
    })
    shareholdersTotal: number
}
