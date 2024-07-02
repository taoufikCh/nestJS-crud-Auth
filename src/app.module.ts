import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './booking/booking.module';
import { PaymentModule } from './payment/payment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment/entities/payment.entity';
import { ConfigModule, ConfigService  } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

import { MailService } from './services/mail.service';
import { PdfService } from './services/pdf.service';


@Module({
  imports: [BookingModule, PaymentModule,
    ConfigModule.forRoot(),
    /*TypeOrmModule.forRoot({
    type: process.env.POSTGRES_TYPE as any,
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: [Payment],
    autoLoadEntities: true,
    synchronize: true,//make it false and use migration 
  }),*/
  ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        console.log('DB Config:', {
          type: configService.get<string>('POSTGRES_TYPE'),
          host: configService.get<string>('POSTGRES_HOST'),
          port: configService.get<number>('POSTGRES_PORT'),
          username: configService.get<string>('POSTGRES_USER'),
          password: configService.get<string>('POSTGRES_PASSWORD'),
          database: configService.get<string>('POSTGRES_DATABASE'),
        });
        return {
          type: configService.get<string>('POSTGRES_TYPE') as any,
          host: configService.get<string>('POSTGRES_HOST'),
          port: configService.get<number>('POSTGRES_PORT'),
          username: configService.get<string>('POSTGRES_USER'),
          password: configService.get<string>('POSTGRES_PASSWORD'),
          database: configService.get<string>('POSTGRES_DATABASE'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
  
    AuthModule,
    
    
  ],
  controllers: [AppController],
  providers: [ 
   /*
   // Apply Roles Guard Globally
    {
    provide: APP_GUARD,
    useClass: RolesGuard,
  },*/
  AppService, MailService, PdfService,],
  
 
})
export class AppModule {}