export class GetAllCompanyDto extends GetAllDto {}
import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { GetAllDto } from '@dtos/base.dto'

export class UpdateCompanyDto {
    @IsOptional()
    @IsString()
    @ApiProperty({
        example: 'Ttm',
        required: false,
    })
    companyName?: string

    @IsOptional()
    @IsString()
    @ApiProperty({
        example: 'donate to our company to build a community center',
        required: false,
    })
    description?: string

    @IsOptional()
    @IsString()
    @ApiProperty({
        example: 'pham hung',
        required: false,
    })
    address?: string

    @IsOptional()
    @IsString()
    @ApiProperty({
        example: 'kiennv@trithucmoi.co',
        required: false,
    })
    email?: string

    @IsOptional()
    @IsString()
    @ApiProperty({
        example: '0989898989',
        required: false,
    })
    phone?: string

    @IsOptional()
    @IsString()
    @ApiProperty({
        example: '(255) 555-01118',
        required: false,
    })
    fax?: string

    @IsOptional()
    @IsString()
    @ApiProperty({
        required: false,
        example: 'service',
    })
    bussinessType?: string

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @ApiProperty({
        required: false,
        example: 1,
    })
    newStatusId?: number

    @IsOptional()
    @IsString()
    @ApiProperty({
        example: 'kiennv',
        required: false,
    })
    newRepresentativeUser?: string

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @ApiProperty({
        example: 1,
        required: false,
    })
    newPlanId?: number

    @IsOptional()
    @IsString()
    @ApiProperty({
        required: false,
        example: '2023-12-20',
    })
    dateOfCorporation?: string
}

export class GetAllCompanyStatusDto extends GetAllDto {}
