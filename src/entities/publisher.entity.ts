import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import Game from './game.entity';

@Entity()
export default class Publisher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  siret: number;

  @Column()
  phone: string;

  @OneToMany(() => Game, game => game.publisher)
  games: Game[]
}