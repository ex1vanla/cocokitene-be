import { PartialType } from '@nestjs/mapped-types'
import { UserStatus } from '@entities/user-status.entity'
import { UserStatusEnum } from '@shares/constants'

export class InsertUserStatusDto extends PartialType(UserStatus) {}

export const userStatusesData: InsertUserStatusDto[] = [
    {
        status: UserStatusEnum.UNVERIFIED,
        description:
            'User has unverified status that has been not verified through email yet',
    },
    {
        status: UserStatusEnum.VERIFIED,
        description:
            'User has verified status that was verified through email, but user cannot login',
    },
    {
        status: UserStatusEnum.ACTIVE,
        description:
            'User has active status that was approved by admin. User can login to the system',
    },
]
