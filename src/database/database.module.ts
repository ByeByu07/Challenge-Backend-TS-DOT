import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseFactory } from './database.factory';
import { DatabaseStrategy } from './database.strategy';
import { PostgresStrategy } from './postgres.strategy';
import { MongoStrategy } from './mongo.strategy';

@Module({})
export class DatabaseModule {
  static forRoot(databaseType: 'postgres' | 'mongodb'): DynamicModule {
    const databaseStrategy = DatabaseModule.getDatabaseStrategy(databaseType);
    const databaseFactory = new DatabaseFactory(databaseStrategy);

    return {
      module: DatabaseModule,
      imports: [TypeOrmModule.forRoot(databaseFactory.createConnection())],
      providers: [
        {
          provide: DatabaseStrategy,
          useClass: databaseStrategy,
        },
        DatabaseFactory,
      ],
      exports: [DatabaseStrategy, DatabaseFactory],
    };
  }

  private static getDatabaseStrategy(databaseType: string): any {
    switch (databaseType) {
      case 'postgres':
        return PostgresStrategy;
      case 'mongodb':
        return MongoStrategy;
      default:
        throw new Error(`Unsupported database type: ${databaseType}`);
    }
  }
}