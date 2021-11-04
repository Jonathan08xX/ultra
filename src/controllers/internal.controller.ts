import { BadRequestException, Controller, Get, InternalServerErrorException, Param } from '@nestjs/common';
import GamesService from '../services/games.service';

@Controller('internal')
export default class InternalController {
  constructor(private readonly gamesService: GamesService) {
  }

  @Get('/remove-older-games')
  async removeOlderGames () {
    try {
      await this.gamesService.removeOlderGames()
    } catch (e) {
      throw new InternalServerErrorException()
    }
  }

  @Get('/apply-discount-games/:id/:start/:end')
  async applyDiscountGamesByMonths (@Param('id') id: string, @Param('start') start: string, @Param('end') end: string) {
    try {
      await this.gamesService.applyDiscountByMonth(+id, +start, +end)
    } catch (e) {
      throw new InternalServerErrorException()
    }
  }

}
