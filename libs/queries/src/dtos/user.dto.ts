import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

export class GetUserByWalletAddressDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '0x9b500a4B354914d420c3D1497AEe4Ba9d45b7Df0',
        required: true,
    })
    @Transform(({ value }) => {
        return value?.toLowerCase()
    })
    walletAddress: string
}

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example: 'leopaulbn@gmail.com',
    })
    email: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'leopaul',
    })
    username: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '0x9b500a4B354914d420c3D1497AEe4Ba9d45b7Df0',
    })
    @Transform(({ value }) => {
        return value?.toLowerCase()
    })
    walletAddress: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example:
            '0x7558dbb143dc091343a3f8244e815132a14243a4dae899a02b23716da839945f7e436876882f59a30c5a768c32fb512f68232626fc81d6f0053ebcda3de90d191b',
    })
    signature: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'USER_SUPER_ADMIN',
    })
    roleName: string
}
