import { TypeOrmExModule } from '@shares/modules'
import { MeetingRepository } from '@repositories/meeting.repository'
import { Module } from '@nestjs/common'

const Repositories = TypeOrmExModule.forCustomRepository([MeetingRepository])
@Module({
    imports: [Repositories],
})
export class CronjobModule {}
