import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { DateTime } from 'luxon';
import Game from '../entities/game.entity';
import CreateGameDto from '../dto/games/create-game.dto';
import UpdateGameDto from '../dto/games/update-game.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export default class GamesService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    private connection: Connection
  ) {}

  async create(createGameDto: CreateGameDto) {
    const game = this.gameRepository.create(createGameDto);
    await this.gameRepository.save(game);
    return this.findOne(game.id);
  }

  async findAll() {
    return this.gameRepository.find({
      select: ['id', 'title', 'price', 'tags', 'releaseDate']
    });
  }

  async findOne(id: number) {
    return this.gameRepository.findOneOrFail(id, {
      select: ['id', 'title', 'price', 'tags', 'releaseDate'],
      relations: [ 'publisher' ]
    }).catch(() => {
      throw new NotFoundException()
    });
  }

  async update(id: number, updateGameDto: UpdateGameDto) {
    await this.gameRepository.update(id, updateGameDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.gameRepository.delete(id).catch(() => {
      throw new NotFoundException();
    });
  }

  @Cron('0 0 * * *')
  async removeOlderGames () {
    const date = DateTime.now().minus({ months: 18 }).toISODate();
    const operation = this.gameRepository
      .createQueryBuilder('game')
      .delete()
      .where('releaseDate < :date', { date });

    return operation.execute().catch(console.error);
  }

  @Cron('0 0 * * *')
  async applyDiscountByMonth (discountId: number = 1, start: number = 18, end: number = 12) {
    const initial = DateTime.now().minus({ months: start }).toISODate();
    const final = DateTime.now().minus({ months: end }).toISODate();

    await this.connection.manager.query(`
        INSERT INTO game_discount ("gameId", "discountId")
        SELECT g.id, $1
        FROM game g
        WHERE g."releaseDate" >= $2::date and g."releaseDate" < $3::date
          AND NOT EXISTS(SELECT FROM game_discount WHERE "gameId" = g.id AND "discountId" = $1)
    `, [ discountId, initial, final ]).catch(console.error)

    await this.calculateNewPricesByDiscount()
  }

  async calculateNewPricesByDiscount () {
    await this.connection.manager.query(`
        UPDATE game
        SET price = ("realPrice" - sq.amountDiscount) * ( (100 - sq.percentageDiscount) / 100 )
            FROM (SELECT gd."gameId", COALESCE(SUM(d.amount), '$0,00') AS amountDiscount, SUM(d.percentage) AS percentageDiscount
        FROM discount d
            INNER JOIN game_discount gd ON d.id = gd."discountId"
        GROUP BY gd."gameId") AS sq
        WHERE id = sq."gameId";
    `, [  ]).catch(console.error)
  }

}
