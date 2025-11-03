import { Module, Logger } from '@nestjs/common';
import { LinkClickHandlerModule } from './link-click-handler/link-click-handler.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PhishingAttemptsModule } from './phishing-attempts/phishing-attempts.module';
import { HealthController } from './health/health.controller';
import { WebSocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    LinkClickHandlerModule,
    WebSocketModule,
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
    PhishingAttemptsModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
