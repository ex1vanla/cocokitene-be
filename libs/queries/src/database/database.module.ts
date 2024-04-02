import {
    Block,
    Company,
    CompanyStatus,
    Election,
    FileMeetingTransaction,
    FileProposalTransaction,
    ParticipantMeetingTransaction,
    Permission,
    Plan,
    Proposal,
    ProposalTransaction,
    Role,
    RoleMtg,
    RolePermission,
    SystemAdmin,
    Transaction,
    User,
    UserRole,
    UserStatus,
    UserVoteParticipant,
    Voting,
    VotingBoard,
    VotingTransaction,
} from '@entities/index'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Meeting } from '@entities/meeting.entity'
import { UserMeeting } from '@entities/user-meeting.entity'
import { MeetingFile } from '@entities/meeting-file.entity'
import { ProposalFile } from '@entities/proposal-file'
import { messageLog } from '@shares/exception-filter'
import { DataSource } from 'typeorm'
import { logger } from '@api/modules/loggers/logger'
import { MeetingRoleMtg } from '@entities/meeting-role-mtg.entity'

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get('database.host'),
                port: +configService.get('database.port'),
                username: configService.get('database.user'),
                password: configService.get('database.pass'),
                database: configService.get('database.name'),
                entities: [
                    Block,
                    Company,
                    CompanyStatus,
                    Plan,
                    Permission,
                    RolePermission,
                    Role,
                    UserStatus,
                    User,
                    SystemAdmin,
                    UserRole,
                    Meeting,
                    UserMeeting,
                    MeetingFile,
                    Proposal,
                    Voting,
                    ProposalFile,
                    Transaction,
                    FileProposalTransaction,
                    ParticipantMeetingTransaction,
                    ProposalTransaction,
                    VotingTransaction,
                    FileMeetingTransaction,
                    VotingBoard,
                    Election,
                    UserVoteParticipant,
                    RoleMtg,
                    MeetingRoleMtg,
                ],
                timezone: 'Z',
                synchronize: configService.get('database.synchronize'),
                debug: false,
                logging: configService.get('database.logging'),
                retryAttempts: 3,
                retryDelay: 10000,
            }),
            inject: [ConfigService],
            dataSourceFactory: async (option) => {
                try {
                    const dataSource = await new DataSource(option).initialize()
                    logger.info(
                        `${messageLog.CONNECT_DATABASE_SUCCESSFULLY.message}`,
                    )
                    return dataSource
                } catch (error) {
                    logger.error(
                        `${messageLog.CONNECT_DATABASE_FAILED.code} ${messageLog.CONNECT_DATABASE_FAILED.message}`,
                    )
                }
            },
        }),
    ],
})
export class DatabaseModule {}
