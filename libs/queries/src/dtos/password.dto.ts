import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        required: true,
        example: 'kienkienkien',
    })
    password: string
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        required: true,
        example: 'kienkienkien',
    })
    confirmPassword: string
}
