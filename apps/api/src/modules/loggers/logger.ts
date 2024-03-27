// import moment from 'moment'
import * as moment from 'moment'
import * as winston from 'winston'

const folderName = process.env.FOLDER_LOG
// get currentDate
const currentDate = moment()
const currentDateFormatted = currentDate.format('YYYY-MM-DD')
const customFormat = winston.format.printf(({ level, message, timestamp }) => {
    const formattedTimestamp = moment(timestamp).format('YYYY-MM-DD HH:mm:ss')

    return `${formattedTimestamp} ${level.toUpperCase()} ${message}`
})

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

export const logger = winston.createLogger({
    transports: [cocokiteneTransport],
})
