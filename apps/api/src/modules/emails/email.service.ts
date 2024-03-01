/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common'

import { UserRepository } from '@repositories/user.repository'
import { ConfigService } from '@nestjs/config'
import { MailerService } from '@nestjs-modules/mailer'
import { MeetingRepository } from '@repositories/meeting.repository'
import { IdMeetingDto } from 'libs/queries/src/dtos/meeting.dto'
import { UserMeetingService } from '@api/modules/user-meetings/user-meeting.service'
import { SystemAdmin } from '@entities/system-admin.entity'
import configuration from '@shares/config/configuration'
import { getIpAddress } from '@shares/utils'

@Injectable()
export class EmailService {
    // private transporter
    constructor(
        private readonly mailerService: MailerService,
        private readonly userRepository: UserRepository,
        private readonly configService: ConfigService,
        private readonly meetingRepository: MeetingRepository,
        private readonly userMeetingService: UserMeetingService,
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
            ipAddress = getIpAddress()
        const resetLink = `http://${ipAddress}:3000/en/reset-password?token=${resetPasswordToken}`
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
}
