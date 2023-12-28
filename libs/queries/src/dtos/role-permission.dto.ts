import {
    IsArray,
    IsInt,
    IsNotEmpty,
    IsNumber,
    ValidateNested,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class RoleIdsOfPermisisonDto {
    @IsInt()
    @Type(() => Number)
    @IsNotEmpty()
    @ApiProperty({
        example: 1,
        required: true,
    })
    @Type(() => Number)
    permissionId: number

    @IsArray()
    @IsNumber({}, { each: true })
    @ApiProperty({
        required: true,
        example: [1, 2],
    })
    roleIds: number[]
}

export class RoleForPermissionDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RoleIdsOfPermisisonDto)
    @ApiProperty({
        type: [RoleIdsOfPermisisonDto],
    })
    assignmentRoleOfPermission: RoleIdsOfPermisisonDto[]
}



export class CreateRolePermissonDto {
    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        example: 1,
    })
    roleId: number

    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        example: 1,
    })
    permissionId: number
}
