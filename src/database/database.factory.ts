import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseStrategy } from './database.strategy';

@Injectable()
export class DatabaseFactory {
  constructor(private databaseStrategy: DatabaseStrategy) {}

  createConnection(): TypeOrmModuleOptions {
    return this.databaseStrategy.createConnectionOptions();
  }
}
