import { Global, Module } from '@nestjs/common'
import { CompanyStatusRepository } from '@repositories/company-status.repository'
import { CompanyRepository } from '@repositories/company.repository'
import { MeetingFileRepository } from '@repositories/meeting-file.repository'
import { MeetingRepository } from '@repositories/meeting.repository'
import { PlanRepository } from '@repositories/plan.repository'
import { ProposalFileRepository } from '@repositories/proposal-file.repository'
import { ProposalRepository } from '@repositories/proposal.repository'
import { RoleRepository } from '@repositories/role.repository'
import { SystemAdminRepository } from '@repositories/system-admin.repository'
import { UserMeetingRepository } from '@repositories/user-meeting.repository'
import { UserRoleRepository } from '@repositories/user-role.repository'
import { UserStatusRepository } from '@repositories/user-status.repository'
import { UserRepository } from '@repositories/user.repository'
import { VotingRepository } from '@repositories/voting.repository'
import { TypeOrmExModule } from '@shares/modules'
import { RolePermissionRepository } from '@repositories/role-permission.repository'
import { PermissionRepository } from '@repositories/permission.repository'
import { RolePermissionRepository } from '@repositories/role-permission.repository'

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
    PlanRepository,
    ProposalFileRepository,
    RolePermissionRepository,
    PermissionRepository,
    RolePermissionRepository,
]

@Global()
@Module({
    imports: [TypeOrmExModule.forCustomRepository(commonRepositories)],
    exports: [TypeOrmExModule],
})
export class GlobalRepository {}
