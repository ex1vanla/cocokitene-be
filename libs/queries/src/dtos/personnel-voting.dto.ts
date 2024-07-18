import { ApiProperty, OmitType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator'
import { CandidateDto } from './candidate.dto'

export class CreatePersonnelVotingDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        required: true,
        example: 'The Manifesto',
    })
    title: string

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        required: true,
        example: 1,
    })
    type: number

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        required: true,
        example: 1,
    })
    meetingId: number

    @ApiProperty({
        required: false,
        type: [CandidateDto],
    })
    @ValidateNested({
        each: true,
    })
    @Type(() => CandidateDto)
    candidate?: CandidateDto[]

    @IsNumber()
    @ApiProperty({
        required: true,
        example: 1,
    })
    creatorId: number
}

export class PersonnelVotingDto extends OmitType(CreatePersonnelVotingDto, [
    'meetingId',
    'creatorId',
]) {
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @ApiProperty({
        required: true,
        example: 1,
    })
    id?: number
}

export class PersonnelVotingDtoUpdate {
    @IsOptional()
    @IsString()
    @ApiProperty({
        required: true,
        example: 'The Manifesto',
    })
    title?: string

    @IsOptional()
    @IsNumber()
    @ApiProperty({
        required: true,
        example: 1,
    })
    type?: number

    @IsOptional()
    @IsNumber()
    @ApiProperty({
        required: true,
        example: 1,
    })
    meetingId?: number
}
