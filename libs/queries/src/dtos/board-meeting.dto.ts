import { ApiProperty } from '@nestjs/swagger'
import {
    IsNotEmpty,
    IsString,
    IsOptional,
    ValidateNested,
    IsArray,
    IsNumber,
} from 'class-validator'
import { MeetingFileDto } from './meeting-file.dto'
import { Type } from 'class-transformer'
import { ProposalDto } from './proposal.dto'
import { CandidateDto } from './candidate.dto'

export class CreateBoardMeetingDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        required: true,
        example: 'Create Board Meeting',
    })
    title: string

    @IsOptional()
    @IsString()
    @ApiProperty({
        example: 'Note of BoardMeeting',
        required: false,
    })
    note: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example: 'https://meet.google.com/mhu-gupg-oux',
        required: true,
    })
    meetingLink: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        required: true,
        example: '2023-12-20 15:00:00',
    })
    startTime: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        required: true,
        example: '2023-12-20 16:00:00',
    })
    endTime: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        required: true,
        example: '2023-12-20 16:00:00',
    })
    endVotingTime: string

    @ApiProperty({
        required: true,
        type: [MeetingFileDto],
    })
    @ValidateNested({
        each: true,
    })
    @Type(() => MeetingFileDto)
    meetingMinutes: MeetingFileDto[]

    @ApiProperty({
        required: true,
        type: [MeetingFileDto],
    })
    @ValidateNested({
        each: true,
    })
    @Type(() => MeetingFileDto)
    meetingInvitations: MeetingFileDto[]

    @ApiProperty({
        required: true,
        type: [ProposalDto],
    })
    @ValidateNested({
        each: true,
    })
    @Type(() => ProposalDto)
    managementAndFinancial: ProposalDto[]

    @ApiProperty({
        required: true,
        type: [ProposalDto],
    })
    @ValidateNested({
        each: true,
    })
    @Type(() => ProposalDto)
    election: ProposalDto[]

    //executiveOfficerElection
    @ApiProperty({
        required: true,
        type: [CandidateDto],
    })
    @ValidateNested({
        each: true,
    })
    @Type(() => CandidateDto)
    candidates: CandidateDto[]
    //

    @IsArray()
    @IsNumber({}, { each: true })
    @ApiProperty({
        required: true,
        example: [1, 2],
    })
    hosts: number[]

    @IsArray()
    @IsNumber({}, { each: true })
    @ApiProperty({
        required: true,
        example: [1, 2],
    })
    controlBoards: number[]

    @IsArray()
    @IsNumber({}, { each: true })
    @ApiProperty({
        required: true,
        example: [1, 2, 3],
    })
    directors: number[]

    @IsArray()
    @IsNumber({}, { each: true })
    @ApiProperty({
        required: true,
        example: [1, 2, 3, 4, 5],
    })
    administrativeCouncils: number[]
}
