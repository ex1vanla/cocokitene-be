import { Block } from '@entities/index';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('database.host'),
          port: +configService.get('database.port'),
          username: configService.get('database.user'),
          password: configService.get('database.pass'),
          database: configService.get('database.name'),
          entities: [Block],
          timezone: 'Z',
          synchronize: configService.get('database.synchronize'),
          debug: false,
          logging: configService.get('database.logging'),
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
