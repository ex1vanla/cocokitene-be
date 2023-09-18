import { UserRepository } from '@repositories/user.repository'
import { UserStatusRepository } from '@repositories/user-status.repository'
import { RoleRepository } from '@repositories/role.repository'
import { Global, Module } from '@nestjs/common'
import { TypeOrmExModule } from '@shares/modules'
import { MeetingRepository } from '@repositories/meeting.repository'
import { UserMeetingRepoisitory } from '@repositories/user-meeting.repoisitory'

const commonRepositories = [
    UserRepository,
    UserStatusRepository,
    RoleRepository,
    MeetingRepository,
    UserMeetingRepoisitory,
]

@Global()
@Module({
    imports: [TypeOrmExModule.forCustomRepository(commonRepositories)],
    exports: [TypeOrmExModule],
})
export class GlobalRepository {}
