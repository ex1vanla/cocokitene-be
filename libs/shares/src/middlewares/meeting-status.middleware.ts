import {
    HttpException,
    HttpStatus,
    Injectable,
    NestMiddleware,
} from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { MeetingRepository } from '@repositories/meeting.repository'
import { StatusMeeting } from '@shares/constants/meeting.const'

@Injectable()
export class MeetingStatusMiddleware implements NestMiddleware {
    constructor(private readonly meetingRepository: MeetingRepository) {}

    async use(req: Request, res: Response, next: NextFunction) {
        // console.log('start middleware')
        const currentDate = new Date()
        try {
            const meetings = await this.meetingRepository.find()
            await Promise.all(
                meetings.map(async (meeting) => {
                    const startTimeMeeting = new Date(meeting.startTime)
                    const endTimeMeeting = new Date(meeting.endTime)

                    if (meeting.status === StatusMeeting.CANCELED) {
                        meeting.status = StatusMeeting.CANCELED
                    } else if (meeting.status === StatusMeeting.DELAYED) {
                        meeting.status = StatusMeeting.DELAYED
                    } else if (currentDate < startTimeMeeting) {
                        meeting.status = StatusMeeting.NOT_HAPPEN
                    } else if (
                        currentDate >= startTimeMeeting &&
                        currentDate <= endTimeMeeting
                    ) {
                        meeting.status = StatusMeeting.HAPPENING
                    } else if (currentDate > endTimeMeeting) {
                        meeting.status = StatusMeeting.HAPPENED
                    }

                    await meeting.save()
                }),
            )

            // console.log('end middleware')
            next()
        } catch (error) {
            throw new HttpException(
                {
                    message: error.message,
                },
                HttpStatus.BAD_REQUEST,
            )
        }
    }
}
