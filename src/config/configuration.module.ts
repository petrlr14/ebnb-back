import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        DB_ENGINE: Joi.string().default('postgres'),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.string(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_DATABASE: Joi.string(),
        DB_SYNCHRONIZE: Joi.boolean(),
        SENDGRID_API_KEY: Joi.string().required(),
        SENDGRID_TEMPLATE: Joi.string().required(),
        SENDGRID_SENDER: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRE: Joi.string().required(),
        FRONT_LINK: Joi.string().required(),
        AZURE_STORAGE_SAS_KEY: Joi.string().required(),
        AZURE_STORAGE_ACCOUNT: Joi.string().required(),
      }),
    }),
  ],
})
export class ConfigurationModule {}
