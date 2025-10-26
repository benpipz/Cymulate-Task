import { Module } from '@nestjs/common';
import { PhishingModule } from './phishing/phishing.module';
import { EmailModule } from './email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    PhishingModule,
    EmailModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.development' }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
