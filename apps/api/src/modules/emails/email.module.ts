import { Module } from '@nestjs/common'
import { EmailService } from '@api/modules/emails/email.service'
import { MailerModule } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'
import { join } from 'path'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'

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
                template: {
                    dir: join(__dirname, 'mail/templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
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
