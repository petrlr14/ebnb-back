import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const url =
          configService.get<string>('DATABASE_URL') ??
          `${configService.get<string>(
            'DB_ENGINE',
          )}://${configService.get<string>(
            'DB_USERNAME',
          )}:${configService.get<string>(
            'DB_PASSWORD',
          )}@${configService.get<string>(
            'DB_HOST',
          )}:${configService.get<number>(
            'DB_PORT',
          )}/${configService.get<string>('DB_DATABASE')}`;
        return {
          type: configService.get<string>('DB_ENGINE'),
          url,
          ssl: configService.get<string>('NODE_ENV') !== 'development',
          logging: configService.get<boolean>('DB_LOGGING', false),
          autoLoadEntities: true,
          synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
        } as TypeOrmModuleOptions;
      },
    }),
  ],
})
export class DatabaseModule {}
