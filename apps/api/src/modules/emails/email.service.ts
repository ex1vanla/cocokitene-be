/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { UserRepository } from '@repositories/user.repository'
import { MailerService } from '@nestjs-modules/mailer'
import { MeetingRepository } from '@repositories/meeting.repository'
import { UserMeetingService } from '@api/modules/user-meetings/user-meeting.service'
import { SystemAdmin } from '@entities/system-admin.entity'
import configuration from '@shares/config/configuration'
import { baseUrlFe } from '@shares/utils'
import { Company } from '@entities/company.entity'
import { User } from '@entities/user.entity'
import { RegisterCompanyDto } from '@dtos/company.dto'
import { FileTypes } from '@shares/constants/meeting.const'
import { MeetingFileService } from '@api/modules/meeting-files/meeting-file.service'
import { RoleBoardMtgEnum, RoleMtgEnum } from '@shares/constants'
import { RoleMtgService } from '@api/modules/role-mtgs/role-mtg.service'
import { MeetingRoleMtgService } from '../meeting-role-mtgs/meeting-role-mtg.service'
import Handlebars from 'handlebars'
import { UserService } from '../users/user.service'

@Injectable()
export class EmailService {
    // private transporter
    constructor(
        private readonly mailerService: MailerService,
        private readonly userRepository: UserRepository,
        private readonly meetingRepository: MeetingRepository,
        private readonly userMeetingService: UserMeetingService,
        private readonly meetingFileService: MeetingFileService,
        private readonly roleMtgService: RoleMtgService,
        private readonly meetingRoleMtgService: MeetingRoleMtgService,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
    ) {}

    async sendEmailMeeting(meetingId: number, companyId: number) {
        const roleMtgShareholder =
            await this.roleMtgService.getRoleMtgByNameAndCompanyId(
                RoleMtgEnum.SHAREHOLDER,
                companyId,
            )
        const idsParticipantsInMeetings =
            await this.userMeetingService.getUserMeetingByMeetingIdAndRole(
                meetingId,
                roleMtgShareholder.id,
            )

        const participants = await Promise.all(
            idsParticipantsInMeetings.map(async (idsParticipantsInMeeting) => {
                const user = await this.userRepository.findOne({
                    where: {
                        id: idsParticipantsInMeeting.user.id,
                    },
                })
                return user
            }),
        )
        const meetingFiles =
            await this.meetingFileService.getMeetingFilesByMeetingIdAndType(
                meetingId,
                FileTypes.MEETING_INVITATION,
            )

        const meeting = await this.meetingRepository.findOne({
            where: {
                id: meetingId,
            },
        })
        const recipientEmails = participants.map(
            (participant) => participant.email,
        )

        const superAdminOfCompany = await this.userService.getSuperAdminCompany(
            companyId,
        )

        const fePort = configuration().fe.port,
            ipAddress = configuration().fe.ipAddress,
            languageJa = configuration().fe.languageJa,
            baseUrl = baseUrlFe(fePort, ipAddress, languageJa),
            detailMeeting = baseUrl + `/meeting/detail/${meeting.id}`,
            numberPhoneService = configuration().phone.numberPhone

        await this.mailerService.sendMail({
            to: recipientEmails,
            cc: superAdminOfCompany?.email ?? '',
            subject: '総会招待通知',
            template: './send-meeting-invite',
            context: {
                title: meeting.title,
                startTime: meeting.startTime,
                endTime: meeting.endTime,
                endVotingTime: meeting.endVotingTime,
                link: meeting.meetingLink,
                detailMeeting: detailMeeting,
                numberPhoneService: numberPhoneService,
                files: meetingFiles.map((item) => item.url),
            },
        })
    }

    async sendEmailBoardMeeting(meetingId: number, companyId: number) {
        //Get unique Board of Board Meeting
        const listRoleBoardMtg =
            await this.meetingRoleMtgService.getMeetingRoleMtgByMeetingId(
                meetingId,
            )
        const roleBoardMtg = listRoleBoardMtg
            .map((item) => item.roleMtg)
            .sort((a, b) => a.roleName.localeCompare(b.roleName))

        const participantsPromises = roleBoardMtg.map(async (roleBoard) => {
            const participantBoardMeeting =
                await this.userMeetingService.getUserMeetingByMeetingIdAndRole(
                    meetingId,
                    roleBoard.id,
                )

            const participantOfRole = participantBoardMeeting.map(
                (participant) => {
                    return {
                        userId: participant.user.id,
                        userEmail: participant.user.email,
                    }
                },
            )

            return {
                roleMtgId: roleBoard.id,
                roleMtgName: roleBoard.roleName,
                userParticipants: participantOfRole,
            }
        })

        const participants = await Promise.all(participantsPromises)

        const idOfHostRoleInMtg = listRoleBoardMtg
            .map((item) => item.roleMtg)
            .filter(
                (role) =>
                    role.roleName.toLocaleUpperCase() ===
                    RoleBoardMtgEnum.HOST.toLocaleUpperCase(),
            )

        const participantBoard = participants
            .filter((item) => item.roleMtgId !== idOfHostRoleInMtg[0]?.id)
            .map((item) => item.userParticipants)
            .flat()

        const cachedObject = {}
        const uniqueParticipantBoard = participantBoard.filter((obj) => {
            if (!cachedObject[obj.userId]) {
                cachedObject[obj.userId] = true
                return true
            }
            return false
        })

        const emailOfBoard = uniqueParticipantBoard.map(
            (board) => board.userEmail,
        )

        const boardMeetingFiles =
            await this.meetingFileService.getMeetingFilesByMeetingIdAndType(
                meetingId,
                FileTypes.MEETING_INVITATION,
            )

        const boardMeeting = await this.meetingRepository.findOne({
            where: {
                id: meetingId,
            },
        })
        const superAdminOfCompany = await this.userService.getSuperAdminCompany(
            companyId,
        )

        const fePort = configuration().fe.port,
            ipAddress = configuration().fe.ipAddress,
            languageJa = configuration().fe.languageJa,
            baseUrl = baseUrlFe(fePort, ipAddress, languageJa),
            detailMeeting =
                baseUrl + `/board-meeting/detail/${boardMeeting.id}`,
            numberPhoneService = configuration().phone.numberPhone

        await this.mailerService.sendMail({
            to: emailOfBoard,
            cc: superAdminOfCompany?.email ?? '',
            subject: '取締役総会招待通知',
            template: './send-meeting-invite',
            context: {
                title: boardMeeting.title,
                startTime: boardMeeting.startTime,
                endTime: boardMeeting.endTime,
                endVotingTime: boardMeeting.endVotingTime,
                link: boardMeeting.meetingLink,
                detailMeeting: detailMeeting,
                numberPhoneService: numberPhoneService,
                files: boardMeetingFiles.map((item) => item.url),
            },
        })
    }

    async sendEmailConfirmResetPassword(systemAdmin: SystemAdmin) {
        const resetPasswordToken = systemAdmin.resetPasswordToken,
            expireTime = systemAdmin.resetPasswordExpireTime,
            emailSystemAdmin = systemAdmin.email,
            fePort = configuration().fe.port,
            ipAddress = configuration().fe.ipAddress,
            languageJa = configuration().fe.languageJa,
            baseUrl = baseUrlFe(fePort, ipAddress, languageJa)

        const resetLink = `${baseUrl}/reset-password?token=${resetPasswordToken}-${expireTime}`
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
        defaultPasswordSuperAdmin: string,
    ) {
        // const emailServer = configuration().email.auth.user,
        const emailServer = configuration().email.cc_emails,
            numberPhoneService = configuration().phone.numberPhone,
            fePort = configuration().fe.port,
            ipAddress = configuration().fe.ipAddress,
            languageJa = configuration().fe.languageJa,
            baseUrl = baseUrlFe(fePort, ipAddress, languageJa)
        await this.mailerService.sendMail({
            to: superAdmin.email,
            cc: emailServer,
            subject: '会社作成通知',
            template: './send-information-super-admin',
            context: {
                usernameSuperAdmin: superAdmin.username,
                emailSuperAdmin: superAdmin.email,
                numberPhoneService: numberPhoneService,
                passwordAdmin: defaultPasswordSuperAdmin,
                baseUrl: baseUrl,
                companyName: companyInformation.companyName,
                taxNumber: companyInformation.taxNumber,
            },
        })
    }

    async sendEmailWhenCreateUserSuccessfully(
        createdUser: User,
        password: string,
        emailSuperAdmin: string,
        taxNumber: string,
    ) {
        const { email, username, shareQuantity, walletAddress, phone } =
            createdUser

        // const emailServer = configuration().email.auth.user,
        const emailServer = configuration().email.cc_emails,
            fePort = configuration().fe.port,
            ipAddress = configuration().fe.ipAddress,
            languageJa = configuration().fe.languageJa,
            baseUrl = baseUrlFe(fePort, ipAddress, languageJa),
            numberPhoneService = configuration().phone.numberPhone

        await this.mailerService.sendMail({
            to: email,
            cc: [emailSuperAdmin, emailServer],
            subject: 'ユーザーアカウント作成通知',
            template: './send-information-create-user-side-user',
            context: {
                username: username,
                email: email,
                password: password,
                baseUrl: baseUrl,
                numberPhoneService: numberPhoneService,
                taxNumber: taxNumber,
            },
        })
    }
    async sendEmailRegisterCompany(registerCompanyDto: RegisterCompanyDto) {
        const cc_emails = configuration().email.cc_emails
        // emailServer = configuration().email.auth.user
        // cc_emails.push(emailServer)
        const numberPhoneService = configuration().phone.numberPhone
        const { note, company, phone, username, email } = registerCompanyDto
        await this.mailerService.sendMail({
            to: email,
            cc: cc_emails,
            subject: 'サービス登録',
            template: './register-info-company-from-user-landing-page',
            context: {
                username: username,
                companyName: company,
                phone: phone,
                email: email,
                note: note,
                numberPhoneService: numberPhoneService,
            },
        })
    }

    async sendEmailConfirmResetPasswordUser(user: User) {
        const resetPasswordToken = user.resetPasswordToken,
            expireTime = user.resetPasswordExpireTime,
            emailUser = user.email,
            fePort = configuration().fe.port,
            ipAddress = configuration().fe.ipAddress,
            languageJa = configuration().fe.languageJa,
            baseUrl = baseUrlFe(fePort, ipAddress, languageJa)

        const resetLink = `${baseUrl}/reset-password-user?token=${resetPasswordToken}-${expireTime}`
        if (!emailUser) {
            console.log('koo co email')
            return
        }
        await this.mailerService.sendMail({
            to: emailUser,
            subject: 'Forgotten Password',
            template: './send-reset-password',
            context: {
                email: emailUser,
                username: user.username,
                resetLink: resetLink,
            },
        })
    }

    //Send a renewal reminder mail
    // async sendEmailReminderRenewal(
    //     companyId: number,
    //     servicePlanId: number,
    //     servicePlanName: string,
    //     expiredTimeService: string,
    // ) {
    //     const cc_emails = configuration().email.cc_emails
    //     const superAdminOfCompany = await this.userService.getSuperAdminCompany(
    //         companyId,
    //     )

    //     await this.mailerService.sendMail({
    //         to: superAdminOfCompany?.email ?? '',
    //         cc: cc_emails,
    //         subject: '【重要】有効期限切れのお知らせ',
    //         template: './send-email-reminder-renewal',
    //         context: {
    //             customerName: '',
    //             expiredDate: expiredTimeService,
    //             planName: servicePlanName,
    //         },
    //     })
    // }

    //Send email notification to system notice about SupperAdmin subscription servicePlan
    async sendEmailToSystemNoticeSubscriptionService(
        systemAdmin: SystemAdmin[],
        companyId: number,
        companyName: string,
        currentServicePlan: string,
        newServicePlanSubscription: string,
        activeDate: string,
        expiredDate: string,
    ) {
        const cc_emails = configuration().email.cc_emails
        const superAdminOfCompany = await this.userService.getSuperAdminCompany(
            companyId,
        )

        const systemAdminMail = systemAdmin.map((system) => system.email)
        const systemAdminName = systemAdmin.map(
            (system) => system.username + '様 ',
        )
        const currentTime = new Date().toLocaleDateString('en-CA')

        await this.mailerService.sendMail({
            to: systemAdminMail,
            cc: [cc_emails, superAdminOfCompany?.email ?? ''],
            subject: 'プラン更新リクエストの受け付け',
            template: './send-email-subscription-service-plan',
            context: {
                customerName: systemAdminName.join(),
                companyName: companyName,
                currentPlan: currentServicePlan,
                newServicePlanSubscription: newServicePlanSubscription,
                activeDate: activeDate,
                expiredDate: expiredDate,
                requestTime: currentTime,
            },
        })
    }

    //Email notification to SuperAdmin notice subscription servicePlan is approved
    async sendEmailNoticeSuperSubscriptionIsApproved(
        companyId: number,
        companyName: string,
        currentServicePlan: string,
        expireDateCurrentServicePlan: string,
        newServicePlanSubscription: string,
        activeDate: string,
        expiredDate: string,
        totalFree: number,
    ) {
        const cc_emails = configuration().email.cc_emails
        const superAdminOfCompany = await this.userService.getSuperAdminCompany(
            companyId,
        )

        await this.mailerService.sendMail({
            to: superAdminOfCompany?.email ?? '',
            cc: [cc_emails],
            subject: 'プラン更新完了のお知らせ',
            template: './send-email-notice-subscription-approved',
            context: {
                customerName: companyName ?? '',
                currentServicePlan: currentServicePlan,
                expireDateCurrentServicePlan: expireDateCurrentServicePlan,
                newServicePlanSubscription: newServicePlanSubscription,
                activeDate: activeDate,
                expiredDate: expiredDate,
                totalFree: totalFree,
            },
        })
    }
}

//Add increase @index in .hbs file
Handlebars.registerHelper('inc', function (value, options) {
    return parseInt(value) + 1
})
