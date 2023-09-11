import { Repository } from 'typeorm';
import { CustomRepository } from '@shares/decorators';
import { UserStatus } from '@entities/user-status.entity';
import { UserStatusEnum } from '@shares/constants';
@CustomRepository(UserStatus)
export class UserStatusRepository extends Repository<UserStatus> {
  async getUserStatusByStatusType(
    statusType: UserStatusEnum,
  ): Promise<UserStatus> {
    const userStatus = await this.findOne({
      where: {
        status: statusType,
      },
    });
    return userStatus;
  }
}
