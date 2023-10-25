import { User } from '@entities/user.entity'

export interface DetailUserReponse extends Partial<User> {
    roleName: string[]
}
