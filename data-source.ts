import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import * as process from 'process';

config();
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  // @ts-ignore
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  migrations: ['migrations/*.ts'],
  synchronize: false,
};

export default new DataSource(dataSourceOptions);
