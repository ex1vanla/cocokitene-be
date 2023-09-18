import { Module } from '@nestjs/common'
import { EmailService } from '@api/modules/emails/email.service'
import { MailerModule } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

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
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule {}
