import { Injectable } from '@nestjs/common'
import { RoleRepository } from '@repositories/role.repository'
import { UserStatusRepository } from '@repositories/user-status.repository'
import { UserRepository } from '@repositories/user.repository'
import { WalletAddressDto } from 'libs/queries/src/dtos/base.dto'

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly userStatusRepository: UserStatusRepository,
        private readonly roleRepository: RoleRepository,
    ) {}

    async getUserNonceByUserWalletAddress(
        walletAddressDto: WalletAddressDto,
    ): Promise<string> {
        const { walletAddress } = walletAddressDto
        const user = await this.userRepository.findOne({
            where: {
                walletAddress: walletAddress,
            },
        })
        return user.nonce
    }
}
