import { Module } from '@nestjs/common'
import { WinstonModule } from 'nest-winston'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as winston from 'winston'
import { MyLoggerService } from '@api/modules/loggers/logger.service'
import * as moment from 'moment'
@Module({
    imports: [
        WinstonModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const folderName = configService.get('log.folderLog')
                // get currentDate
                const currentDate = moment()
                const currentDateFormatted = currentDate.format('YYYY-MM-DD')
                const customFormat = winston.format.printf(
                    ({ level, message, timestamp }) => {
                        const formattedTimestamp = moment(timestamp).format(
                            'YYYY-MM-DD HH:mm:ss',
                        )

                        return `${formattedTimestamp} ${level.toUpperCase()} ${message}`
                    },
                )
                const cocokiteneTransport = new winston.transports.File({
                    filename: `${folderName}/cocokitene-${currentDateFormatted}.log`,
                    level: 'debug',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.json(),
                        customFormat,
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
