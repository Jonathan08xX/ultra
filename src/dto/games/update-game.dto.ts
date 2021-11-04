import { PartialType } from '@nestjs/mapped-types';
import CreateGameDto from './create-game.dto';

export default class UpdateGameDto extends PartialType(CreateGameDto) {}
