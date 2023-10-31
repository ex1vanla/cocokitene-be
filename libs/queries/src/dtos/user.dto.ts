import {
    ArrayMinSize,
    IsArray,
    IsEmail,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { GetAllDto } from '@dtos/base.dto'
import { FileTypes } from '@shares/constants/meeting.const'

export class UpdateUserAvatarDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        required: true,
        example: 'https://www.africau.edu/images/default/sample.pdf',
    })
    avatar: string

    @IsEnum(FileTypes)
    @ApiProperty({
        required: true,
        example: FileTypes.AVATARS,
        enum: FileTypes,
    })
    fileType: FileTypes
}

export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    @IsString()
    @ApiProperty({
        required: false,
        example: 'leopaulbn@gmail.com',
    })
    email?: string

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false,
        example: 'leopaul',
    })
    username?: string

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false,
        example: '0x9b500a4B354914d420c3D1497AEe4Ba9d45b7Df0',
    })
    @Transform(({ value }) => {
        return value?.toLowerCase()
    })
    walletAddress?: string

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        required: false,
        example: 100,
    })
    shareQuantity?: number

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false,
        example: '0868071819',
    })
    phone?: string

    @IsArray()
    @IsOptional()
    @ArrayMinSize(1)
    @IsInt({ each: true })
    @ApiProperty({
        required: false,
        example: [1, 3, 4],
    })
    roleIds?: number[]

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        required: false,
        example: 1,
    })
    statusId?: number

    @ApiProperty({
        required: false,
        // type: [UserAvatarDto],
    })
    @ValidateNested({
        each: true,
    })
    @Type(() => UpdateUserAvatarDto)
    userAvatar?: UpdateUserAvatarDto
}

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

    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(1)
    @IsInt({ each: true })
    @ApiProperty({
        example: 1,
    })
    roleIds: number[]
}

export class GetAllUsersDto extends GetAllDto {}

export class SuperAdminDto {
    @IsOptional()
    @IsString()
    @ApiProperty({
        example: 'MrAnhPhuong',
        required: false,
    })
    username?: string

    @IsOptional()
    @IsString()
    @ApiProperty({
        example: '0xB0C6abf8BAC799F27FE4D46ab2Ffb683129f59b1',
        required: false,
    })
    walletAddress?: string

    @IsOptional()
    @IsString()
    @ApiProperty({
        example: 'nguyenkien123ns@gmail.com',
        required: false,
    })
    email?: string

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @ApiProperty({
        required: false,
        example: 2,
    })
    newStatusId?: number
}
