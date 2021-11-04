import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, BeforeInsert } from 'typeorm';
import Publisher from './publisher.entity';
import Discount from './discount.entity';

@Entity()
export default class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('money')
  price: number;

  @Column('money')
  realPrice: number;

  @Column('text', { array: true })
  tags: string[];

  @Column('date')
  releaseDate: Date;

  @Column()
  publisherId: number;

  @ManyToOne(() => Publisher, publisher => publisher.id)
  publisher: Publisher;

  @ManyToMany(() => Discount)
  @JoinTable({ name: 'game_discount' })
  discounts: Discount[];

  @BeforeInsert()
  async beforeInsert () {
    this.realPrice = this.price
  }
}