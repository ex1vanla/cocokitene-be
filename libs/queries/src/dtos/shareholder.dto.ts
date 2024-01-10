import { IsEnum, IsOptional } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'
import { GetAllDto } from '@dtos/base.dto'
import { Sort_By_Order } from '@shares/constants'

export class GetAllShareholderDto extends GetAllDto {
    @IsOptional()
    @IsEnum(Sort_By_Order)
    @ApiProperty({
        required: false,
        example: Sort_By_Order.ASC,
        default: Sort_By_Order.ASC,
        enum: Sort_By_Order,
    })
    sortOrder?: Sort_By_Order
}
