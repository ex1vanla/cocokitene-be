import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common'
import { DashBoardController } from './dash-board.controller'
import { MeetingModule } from '../meetings/meeting.module'
import { DashBoardService } from './dash-board.service'
import { MeetingStatusMiddleware } from '@shares/middlewares/meeting-status.middleware'

@Module({
    imports: [MeetingModule],
    controllers: [DashBoardController],
    providers: [DashBoardService],
    exports: [DashBoardService],
})
export class DashBoardModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(MeetingStatusMiddleware)
            .exclude(
                {
                    path: '/api/dash-board/meeting-in-day',
                    method: RequestMethod.GET,
                },
                {
                    path: '/api/dash-board/meeting-in-month/statistics',
                    method: RequestMethod.GET,
                },
            )
            .forRoutes(DashBoardController)
    }
}

// export class DashBoardModule{}
