import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        required: true,
        example: 'kienkien',
    })
    currentPassword: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        required: true,
        example: 'kien123',
    })
    newPassword: string
}
