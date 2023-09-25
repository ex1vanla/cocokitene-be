import { ApiProperty, OmitType } from '@nestjs/swagger'
import { ProposalType } from '@shares/constants/proposal.const'
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator'

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

    @IsEnum(ProposalType)
    @ApiProperty({
        required: true,
        enum: ProposalType,
    })
    type: ProposalType
}

export class ProposalDto extends OmitType(CreateProposalDto, ['meetingId']) {}
