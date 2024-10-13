import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseStrategy } from './database.strategy';

@Injectable()
export class MongoStrategy extends DatabaseStrategy {
  createConnectionOptions(): TypeOrmModuleOptions {
    return {
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      database: 'blog_db',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    };
  }
}