import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UnprocessableEntityException
} from '@nestjs/common';
import GamesService from '../services/games.service';
import CreateGameDto from '../dto/games/create-game.dto';
import UpdateGameDto from '../dto/games/update-game.dto';

@Controller('games')
export default class GamesController {
  constructor(private readonly gamesService: GamesService) {
  }

  @Post()
  create(@Body() createGameDto: CreateGameDto) {
    return this.gamesService.create(createGameDto);
  }

  @Get()
  findAll() {
    return this.gamesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.gamesService.findOne(+id);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    try {
      return this.gamesService.update(+id, updateGameDto);
    } catch (e) {
      throw new UnprocessableEntityException()
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gamesService.remove(+id);
  }

}
