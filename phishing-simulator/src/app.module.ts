import { Module, Logger } from '@nestjs/common';
import { PhishingModule } from './phishing/phishing.module';
import { PhishingEmailModule } from './phishing-email/phishing-email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    PhishingModule,
    PhishingEmailModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
      validate: (config) => {
        // Basic validation - log warnings for missing optional config
        const logger = new Logger('ConfigValidation');
        if (!config.MONGO_URI) {
          logger.warn('MONGO_URI is not set - MongoDB connection may fail');
        }
        return config;
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
