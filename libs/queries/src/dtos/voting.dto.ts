import { IsEnum, IsNumber } from 'class-validator'
import { ApiProperty, OmitType } from '@nestjs/swagger'
import { VoteProposalResult } from '@shares/constants/proposal.const'

export class CreateVoteProposalDto {
    @IsEnum(VoteProposalResult)
    @ApiProperty({
        required: true,
        enum: VoteProposalResult,
    })
    result: VoteProposalResult

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
    proposalId: number
}

export class VoteProposalDto extends OmitType(CreateVoteProposalDto, [
    'userId',
    'proposalId',
]) {}
