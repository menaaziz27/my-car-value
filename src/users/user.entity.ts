import {
  AfterInsert,
  AfterRemove,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  // typeorm hooks don't work with plain objects
  // it works with entity instances only eg.. repo.create(user)
  @AfterInsert()
  logInsert() {
    console.log('Inserted an instance with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed an instance with id', this.id);
  }
}
