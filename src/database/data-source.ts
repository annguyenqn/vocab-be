import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { User } from '../modules/users/entities/user.entity';
import { MainSeeder } from './seeds/seeder';
import { UsersFactory } from './factories/users.factory';
import * as dotenv from 'dotenv';
dotenv.config();
export const AppDataSource: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [User],
  factories: [UsersFactory],
  seeds: [MainSeeder],
  migrations: ['./src/migrations/**/*{.ts,.js}'],
  synchronize: false,
};
const dataSource = new DataSource(AppDataSource);
dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  process.exit();
});
