import { GetAllUsersDto } from '@dtos/user.dto'
import { User } from '@entities/user.entity'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UserRepository } from '@repositories/user.repository'
import { httpErrors } from '@shares/exception-filter'
import { WalletAddressDto } from 'libs/queries/src/dtos/base.dto'
import { Pagination } from 'nestjs-typeorm-paginate'

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async getUserNonceByUserWalletAddress(
        walletAddressDto: WalletAddressDto,
    ): Promise<string> {
        const { walletAddress } = walletAddressDto
        const user = await this.userRepository.findOne({
            where: {
                walletAddress: walletAddress,
            },
        })
        if (!user) {
            throw new HttpException(
                httpErrors.USER_NOT_FOUND,
                HttpStatus.BAD_REQUEST,
            )
        }
        return user.nonce
    }

    async getAllUsersCompany(
        getAllUsersDto: GetAllUsersDto,
        companyId: number,
    ): Promise<Pagination<User>> {
        const users = await this.userRepository.getAllUsersCompany(
            getAllUsersDto,
            companyId,
        )

        return users
    }

    // async getUserByMeetingIdAndRole(
    //     meetingId: number,
    //     role: MeetingRole,
    // ): Promise<User[]> {
    //     const users = this.userRepository.getUserByMeetingIdAndRole(
    //         meetingId,
    //         role,
    //     )

    //     return users
    // }
}
