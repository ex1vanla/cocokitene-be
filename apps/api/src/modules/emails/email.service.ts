/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common'

import { UserRepository } from '@repositories/user.repository'
import { ConfigService } from '@nestjs/config'
import { In } from 'typeorm'
import { MailerService } from '@nestjs-modules/mailer'
import { MeetingRepository } from '@repositories/meeting.repository'
import { IdMeetingDto } from 'libs/queries/src/dtos/meeting.dto'

@Injectable()
export class EmailService {
    private transporter
    constructor(
        private readonly mailerService: MailerService,
        private readonly userRepository: UserRepository,
        private readonly configService: ConfigService,
        private readonly meetingRepository: MeetingRepository,
    ) {}

    // async sendEmail(idMeetingDto: IdMeetingDto, companyId: number) {
    //     const { meetingId } = idMeetingDto
    //
    //     const shareholders = await this.userRepository.find({
    //         where: {
    //             companyId,
    //             role: {
    //                 roleName: In(['SHAREHOLDER', 'ADMIN']),
    //             },
    //         },
    //         select: ['email'],
    //         relations: ['role'],
    //     })
    //     const meeting = await this.meetingRepository.findOne({
    //         where: {
    //             id: meetingId,
    //         },
    //     })
    //     const recipientEmails = shareholders.map(
    //         (shareholder) => shareholder.email,
    //     )
    //     for (const recipient of recipientEmails) {
    //         await this.mailerService.sendMail({
    //             to: recipient,
    //             subject: 'Hello guys, this is meeting information',
    //             template: 'send-meeting-invite',
    //             context: {
    //                 meetingTitle: meeting.title,
    //                 meetingStartTime: meeting.startTime,
    //                 meetingEndTime: meeting.endTime || 'unknown',
    //                 meetingLink: meeting.meetingLink,
    //                 // meetingReport: meeting.meetingReport,
    //                 // meetingInvitation: meeting.meetingInvitation,
    //             },
    //         })
    //     }
    // }
}
