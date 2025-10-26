import { Module } from '@nestjs/common';
import { TrackingModule } from './tracking/tracking.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PhishingAttemptsModule } from './phishing-attempts/phishing-attempts.module';

@Module({
  imports: [
    TrackingModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.development' }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    PhishingAttemptsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
