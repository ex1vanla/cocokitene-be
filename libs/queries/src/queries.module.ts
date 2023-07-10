import { Module } from '@nestjs/common';
import { QueriesService } from './queries.service';

@Module({
  providers: [QueriesService],
  exports: [QueriesService],
})
export class QueriesModule {}
