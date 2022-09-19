import { Report } from 'src/reports/report.entity';
import {
  AfterInsert,
  AfterRemove,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ default: true })
  isAdmin: boolean;

  @Column()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

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
