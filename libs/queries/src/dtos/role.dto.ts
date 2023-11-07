import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { GetAllDto } from '@dtos/base.dto'
import { ProposalType } from '@shares/constants/proposal.const'
import { RoleEnum } from '@shares/constants'

export class ActiveUserDto {
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    @ApiProperty({
        example: 1,
    })
    id: number
}

export class GetAllNormalRolesDto extends GetAllDto {}

export class GetAllImportantRoleDto extends GetAllDto {}

export class CreateCompanyRoleDto {
    @IsEnum(RoleEnum)
    @ApiProperty({
        required: true,
        enum: RoleEnum,
    })
    type: ProposalType

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    @ApiProperty({
        example: 1,
    })
    companyId: number
}
