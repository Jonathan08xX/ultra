import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import GamesService from '../services/games.service';
import GamesController from '../controllers/games.controller';
import Game from '../entities/game.entity';
import Publisher from '../entities/publisher.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ Game, Publisher ]), ],
  providers: [GamesService],
  controllers: [GamesController],
})
export default class GamesModule {}
