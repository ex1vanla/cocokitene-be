import { Module } from '@nestjs/common'
import { EmailService } from '@api/modules/emails/email.service'
import { MailerModule } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'
import { join } from 'path'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { UserMeetingModule } from '@api/modules/user-meetings/user-meeting.module'
import { UserStatusModule } from '@api/modules/user-status/user-status.module'
import { CompanyStatusModule } from '@api/modules/company-status/company-status.module'
import { UserRoleModule } from '@api/modules/user-roles/user-role.module'

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    host: configService.get('email.host'),
                    port: configService.get('email.port'),
                    secure: configService.get('email.secure'),
                    auth: {
                        user: configService.get('email.auth.user'),
                        pass: configService.get('email.auth.password'),
                    },
                },
                defaults: {
                    from: configService.get('email.auth.user'),
                },
                template: {
                    dir: join(__dirname, 'modules/emails/templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
            inject: [ConfigService],
        }),
        UserMeetingModule,
        UserStatusModule,
        CompanyStatusModule,
        UserRoleModule,
    ],

    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule {}
