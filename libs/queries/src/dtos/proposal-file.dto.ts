import { ApiProperty, OmitType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateProposalFileDto {
    @IsOptional()
    @IsString()
    @ApiProperty({
        required: false,
        example: 'rc-upload-1699469029013-7',
    })
    uid?: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        required: true,
        example: 'https://www.africau.edu/images/default/sample.pdf',
    })
    url: string

    @IsNumber()
    @ApiProperty({
        required: true,
        example: 1,
    })
    proposalId: number
}

export class ProposalFileDto extends OmitType(CreateProposalFileDto, [
    'proposalId',
]) {
    @IsOptional()
    @IsNumber()
    @ApiProperty({
        required: true,
        example: 1,
    })
    id?: number
}
