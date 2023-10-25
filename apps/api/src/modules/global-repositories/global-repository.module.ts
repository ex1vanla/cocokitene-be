import { UserRepository } from '@repositories/user.repository'
import { UserStatusRepository } from '@repositories/user-status.repository'
import { RoleRepository } from '@repositories/role.repository'
import { Global, Module } from '@nestjs/common'
import { TypeOrmExModule } from '@shares/modules'
import { MeetingRepository } from '@repositories/meeting.repository'
import { UserMeetingRepository } from '@repositories/user-meeting.repository'
import { MeetingFileRepository } from '@repositories/meeting-file.repository'
import { ProposalRepository } from '@repositories/proposal.repository'
import { VotingRepository } from '@repositories/voting.repository'
import { UserRoleRepository } from '@repositories/user-role.repository'
import { SystemAdminRepository } from '@repositories/system-admin.repository'
import { CompanyRepository } from '@repositories/company.repository'
import { PlanRepository } from '@repositories/plan.repository'
import { CompanyStatusRepository } from '@repositories/company-status.repository'

const commonRepositories = [
    UserRepository,
    UserStatusRepository,
    RoleRepository,
    UserRoleRepository,
    MeetingRepository,
    UserMeetingRepository,
    MeetingFileRepository,
    ProposalRepository,
    VotingRepository,
    SystemAdminRepository,
    CompanyRepository,
    PlanRepository,
    CompanyStatusRepository,
]

@Global()
@Module({
    imports: [TypeOrmExModule.forCustomRepository(commonRepositories)],
    exports: [TypeOrmExModule],
})
export class GlobalRepository {}
