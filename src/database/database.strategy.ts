import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export abstract class DatabaseStrategy {
  abstract createConnectionOptions(): TypeOrmModuleOptions;
}