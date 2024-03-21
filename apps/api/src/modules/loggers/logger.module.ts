import { Module } from '@nestjs/common'
import { WinstonModule } from 'nest-winston'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as winston from 'winston'
import { MyLoggerService } from '@api/modules/loggers/logger.service'

@Module({
    imports: [
        WinstonModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const folderName = configService.get('log.folderLog')
                const currentDate = new Date(),
                    currentDateFormatted = `${currentDate.getFullYear()}-${(
                        currentDate.getMonth() + 1
                    )
                        .toString()
                        .padStart(2, '0')}-${currentDate
                        .getDate()
                        .toString()
                        .padStart(2, '0')}`
                const cocokiteneTransport = new winston.transports.File({
                    filename: `${folderName}/cocokitene-${currentDateFormatted}.log`,
                    level: 'debug',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.json(),
                    ),
                    options: { flags: 'a' },
                })

                return winston.createLogger({
                    transports: [cocokiteneTransport],
                })
            },
            inject: [ConfigService],
        }),
    ],
    providers: [MyLoggerService],
    exports: [MyLoggerService],
})
export class MyLoggerModule {}
