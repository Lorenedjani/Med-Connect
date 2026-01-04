import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';

import { createDataSource } from './config/typeorm.config';

// Configuration
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import storageConfig from './config/storage.config';
import encryptionConfig from './config/encryption.config';
import notificationConfig from './config/notification.config';

// Common modules
import { CommonModule } from './common/common.module';

// Feature modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RecordsModule } from './modules/records/records.module';
// import { ConsentModule } from './modules/consent/consent.module';
import { Consent } from './modules/consent/entities/consent.entity';
import { Connection } from './modules/consent/entities/connection.entity';
import { AccessLog } from './modules/consent/entities/access-log.entity';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { CommunicationsModule } from './modules/communications/communications.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AdminModule } from './modules/admin/admin.module';

// Event handlers
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        jwtConfig,
        storageConfig,
        encryptionConfig,
        notificationConfig,
      ],
      envFilePath: ['.env.local', '.env'],
    }),

    // Database - PostgreSQL
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.postgresql.host'),
        port: configService.get('database.postgresql.port'),
        username: configService.get('database.postgresql.username'),
        password: configService.get('database.postgresql.password'),
        database: configService.get('database.postgresql.database'),
        ssl: configService.get('database.postgresql.ssl') ? { rejectUnauthorized: false } : false,
        synchronize: configService.get('database.postgresql.synchronize'),
        logging: configService.get('database.postgresql.logging'),
        entities: [
          'dist/**/*.entity{.ts,.js}',
          Consent,
          Connection,
          AccessLog,
        ],
        migrations: ['dist/database/migrations/*{.ts,.js}'],
        migrationsTableName: 'migrations',
      }),
      inject: [ConfigService],
    }),

    // Database - MongoDB
    MongooseModule.forRootAsync({
      useFactory: (configService) => ({
        uri: configService.get('database.mongodb.uri'),
        ...configService.get('database.mongodb.options'),
      }),
      inject: ['ConfigService'],
    }),

    // Cache
    CacheModule.registerAsync({
      useFactory: (configService) => ({
        store: 'redis',
        host: configService.get('database.redis.host'),
        port: configService.get('database.redis.port'),
        password: configService.get('database.redis.password'),
        db: configService.get('database.redis.db'),
        ttl: configService.get('database.redis.ttl'),
      }),
      inject: ['ConfigService'],
      isGlobal: true,
    }),

    // Events
    EventEmitterModule.forRoot(),

    // Rate limiting - Temporarily disabled for build
    // ThrottlerModule.forRoot({
    //   ttl: 60,
    //   limit: 100,
    // }),

    // Scheduling
    ScheduleModule.forRoot(),

    // Queue (Bull)
    BullModule.forRootAsync({
      useFactory: (configService) => ({
        redis: {
          host: configService.get('database.redis.host'),
          port: configService.get('database.redis.port'),
          password: configService.get('database.redis.password'),
          db: configService.get('database.redis.db'),
        },
      }),
      inject: ['ConfigService'],
    }),

    // Common utilities
    CommonModule,

    // Feature modules
    AuthModule,
    UsersModule,
    RecordsModule,
    // ConsentModule,
    AppointmentsModule,
    SchedulesModule,
    CommunicationsModule,
    NotificationsModule,
    AnalyticsModule,
    AdminModule,

    // Event handlers
    EventsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
