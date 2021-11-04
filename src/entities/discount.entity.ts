import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Discount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('money', { nullable: true })
  amount: number;

  @Column('numeric', { nullable: true })
  percentage: number;
}