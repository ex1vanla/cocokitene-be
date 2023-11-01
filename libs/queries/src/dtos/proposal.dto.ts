import { ApiProperty, OmitType } from '@nestjs/swagger'
import { ProposalType } from '@shares/constants/proposal.const'
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator'
import { Type } from 'class-transformer'

export class GetAllProposalDto {
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

    @IsEnum(ProposalType)
    @ApiProperty({
        required: true,
        enum: ProposalType,
    })
    type: ProposalType
}

export class CreateProposalDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        required: true,
        example: 'Approve the final budget',
    })
    title: string

    @IsOptional()
    @IsString()
    @ApiProperty({
        required: false,
        example: 'Approve the final budget description',
    })
    description: string

    @IsNumber()
    @ApiProperty({
        required: true,
        example: 1,
    })
    meetingId: number

    @IsNumber()
    @ApiProperty({
        required: true,
        example: 1,
    })
    creatorId: number

    @IsEnum(ProposalType)
    @ApiProperty({
        required: true,
        enum: ProposalType,
    })
    type: ProposalType

    @IsNumber()
    @ApiProperty({
        required: true,
        example: 100,
    })
    notVoteYetQuantity: number
}

export class ProposalDto extends OmitType(CreateProposalDto, [
    'meetingId',
    'creatorId',
    'notVoteYetQuantity',
]) {
    @IsOptional()
    @IsNumber()
    @ApiProperty({
        required: true,
        example: 1,
    })
    id?: number
}

export class ProposalDtoUpdate {
    @IsOptional()
    @IsString()
    @ApiProperty({
        required: false,
        example: 'Approve the final budget',
    })
    title: string

    @IsOptional()
    @IsString()
    @ApiProperty({
        required: false,
        example: 'Approve the final budget description',
    })
    description: string

    @IsEnum(ProposalType)
    @ApiProperty({
        required: true,
        enum: ProposalType,
    })
    type: ProposalType
}
