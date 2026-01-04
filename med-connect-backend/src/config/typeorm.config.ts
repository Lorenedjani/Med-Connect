import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const createDataSource = (configService: ConfigService): DataSource => {
  const dbConfig = configService.get('database.postgresql');

  return new DataSource({
    type: 'postgres',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    ssl: dbConfig.ssl ? { rejectUnauthorized: false } : false,
    synchronize: dbConfig.synchronize,
    logging: dbConfig.logging,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/database/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations',
    subscribers: ['dist/**/*.subscriber{.ts,.js}'],
    cache: {
      type: 'redis',
      options: {
        host: configService.get('database.redis.host'),
        port: configService.get('database.redis.port'),
        password: configService.get('database.redis.password'),
        db: configService.get('database.redis.db'),
      },
      duration: configService.get('database.redis.ttl') * 1000, // Convert to milliseconds
    },
  });
};

