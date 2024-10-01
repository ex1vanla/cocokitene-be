import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class UpdateServicePlanForCompanyDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        example: '1',
        required: true,
    })
    companyId: number

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        example: '1',
        required: true,
    })
    planId: number

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        required: true,
        example: '2023-12-20',
    })
    expirationDate: string
}

export class ServicePlanForCompanyDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        example: '1',
        required: true,
    })
    companyId: number

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        example: '1',
        required: true,
    })
    planId: number

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        example: '100',
        required: true,
    })
    meetingLimit: number

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        example: '100',
        required: true,
    })
    accountLimit: number

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        example: '10',
        required: true,
    })
    storageLimit: number

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        required: true,
        example: '2023-12-20',
    })
    expirationDate: string
}
