/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common'

import { UserRepository } from '@repositories/user.repository'
import { MailerService } from '@nestjs-modules/mailer'
import { MeetingRepository } from '@repositories/meeting.repository'
import { IdMeetingDto } from 'libs/queries/src/dtos/meeting.dto'
import { UserMeetingService } from '@api/modules/user-meetings/user-meeting.service'
import { SystemAdmin } from '@entities/system-admin.entity'
import configuration from '@shares/config/configuration'
import { baseUrlFe } from '@shares/utils'
import { Company } from '@entities/company.entity'
import { User } from '@entities/user.entity'
import { UserStatusService } from '@api/modules/user-status/user-status.service'
import { CompanyStatusService } from '@api/modules/company-status/company-status.service'
import { CompanyStatusEnum, UserStatusEnum } from '@shares/constants'

@Injectable()
export class EmailService {
    // private transporter
    constructor(
        private readonly mailerService: MailerService,
        private readonly userRepository: UserRepository,
        private readonly meetingRepository: MeetingRepository,
        private readonly userMeetingService: UserMeetingService,
        private readonly userStatusService: UserStatusService,
        private readonly companyStatusService: CompanyStatusService,
    ) {}

    async sendEmailMeeting(idMeetingDto: IdMeetingDto, companyId: number) {
        const { meetingId } = idMeetingDto

        const idsParticipantsInMeetings =
            await this.userMeetingService.getAllIdsParticipantsInMeeting(
                meetingId,
            )

        const participants = await Promise.all(
            idsParticipantsInMeetings.map(async (idsParticipantsInMeeting) => {
                const user = await this.userRepository.findOne({
                    where: {
                        id: idsParticipantsInMeeting,
                    },
                })
                return user
            }),
        )

        const meeting = await this.meetingRepository.findOne({
            where: {
                id: meetingId,
            },
        })
        const recipientEmails = participants.map(
            (participant) => participant.email,
        )
        // console.log('recipientEmails-----', recipientEmails)
        await Promise.all([
            recipientEmails.map((recipientEmail) =>
                this.mailerService.sendMail({
                    to: recipientEmail,
                    subject: 'Hello guys, this is meeting information',
                    template: './send-meeting-invite',
                    context: {
                        meetingTitle: meeting.title,
                        meetingStartTime: meeting.startTime,
                        meetingEndTime: meeting.endTime || 'unknown',
                        meetingLink: meeting.meetingLink,
                    },
                }),
            ),
        ])
    }

    async sendEmailConfirmResetPassword(systemAdmin: SystemAdmin) {
        const resetPasswordToken = systemAdmin.resetPasswordToken,
            emailSystemAdmin = systemAdmin.email,
            fePort = configuration().fe.port,
            ipAddress = configuration().fe.ipAddress,
            languageEn = configuration().fe.languageEn,
            baseUrl = baseUrlFe(fePort, ipAddress, languageEn)

        const resetLink = `${baseUrl}/reset-password?token=${resetPasswordToken}`
        if (!emailSystemAdmin) {
            console.log('koo co email')
            return
        }
        await this.mailerService.sendMail({
            to: emailSystemAdmin,
            subject: 'Forgotten Password',
            template: './send-reset-password',
            context: {
                email: emailSystemAdmin,
                username: systemAdmin.username,
                resetLink: resetLink,
            },
        })
    }

    async sendEmailWhenCreatedCompanySuccesfully(
        superAdmin: User,
        companyInformation: Company,
        systemAdmin: SystemAdmin,
        defaultPasswordSuperAdmin: string,
    ) {
        const emailSystemAdmin = systemAdmin.email,
            statusSuperAdmin = await this.userStatusService.getStatusById(
                superAdmin.statusId,
            ),
            statusCompany =
                await this.companyStatusService.getCompanyStatusById(
                    companyInformation.statusId,
                )
        await this.mailerService.sendMail({
            from: emailSystemAdmin,
            to: superAdmin.email,
            subject: 'Super admin information',
            template: './send-information-super-admin',
            context: {
                usernameSuperAdmin: superAdmin.username,
                emailSuperAdmin: superAdmin.email,
                walletAddressSuperAdmin: superAdmin.walletAddress,
                roleSuperAdmin: 'Super Admin',
                passwordAdmin: defaultPasswordSuperAdmin,
                statusSuperAdmin:
                    statusSuperAdmin.status === UserStatusEnum.ACTIVE
                        ? 'Active'
                        : 'Inactive',
                companyName: companyInformation.companyName,
                statusCompany:
                    statusCompany.status === CompanyStatusEnum.ACTIVE
                        ? 'Active'
                        : 'Inactive',
                descriptionCompany: companyInformation.description,
                addressCompany: companyInformation.address,
                companyShortname: companyInformation.companyShortName,
                emailCompany: companyInformation.email,
                dateOfCorporation: companyInformation.dateOfCorporation,
                phoneCompany: companyInformation.phone,
                fax: companyInformation.fax,
                taxNumber: companyInformation.taxNumber,
                businessType: companyInformation.businessType,
                representativeUser: companyInformation.representativeUser,
            },
        })
        await this.mailerService.sendMail({
            to: emailSystemAdmin,
            subject: 'Company information',
            template: './send-information-create-company-from-system-admin',
            context: {
                systemAdminUsername: systemAdmin.username,
                usernameSuperAdmin: superAdmin.username,
                emailSuperAdmin: superAdmin.email,
                walletAddressSuperAdmin: superAdmin.walletAddress,
                roleSuperAdmin: 'Super Admin',
                passwordAdmin: defaultPasswordSuperAdmin,
                statusSuperAdmin:
                    statusSuperAdmin.status === UserStatusEnum.ACTIVE
                        ? 'Active'
                        : 'Inactive',
                companyName: companyInformation.companyName,
                statusCompany:
                    statusCompany.status === CompanyStatusEnum.ACTIVE
                        ? 'Active'
                        : 'Inactive',
                descriptionCompany: companyInformation.description,
                addressCompany: companyInformation.address,
                companyShortname: companyInformation.companyShortName,
                emailCompany: companyInformation.email,
                dateOfCorporation: companyInformation.dateOfCorporation,
                phoneCompany: companyInformation.phone,
                fax: companyInformation.fax,
                taxNumber: companyInformation.taxNumber,
                businessType: companyInformation.businessType,
                representativeUser: companyInformation.representativeUser,
            },
        })
    }
}
