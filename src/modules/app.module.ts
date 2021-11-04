import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import InternalController from '../controllers/internal.controller';
import AppController from '../controllers/app.controller';
import Game from '../entities/game.entity';
import Publisher from '../entities/publisher.entity';
import Discount from '../entities/discount.entity';
import GamesModule from './games.module';
import GamesService from '../services/games.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ ConfigModule ],
      useFactory: (configService: ConfigService) => ({
        type: configService.get('DATABASE_TYPE'),
        url: configService.get('DATABASE_URL'),
        entities: [ Game, Publisher, Discount ],
        synchronize: true
      }),
      inject: [ ConfigService ]
    }),
    TypeOrmModule.forFeature([ Game, Publisher, Discount ]),
    ScheduleModule.forRoot(),

    // App modules
    GamesModule
  ],
  controllers: [ AppController, InternalController ],
  providers: [ GamesService ]
})
export class AppModule {
}
