import { IsNotEmpty, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { GetAllDto } from '@dtos/base.dto'

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
