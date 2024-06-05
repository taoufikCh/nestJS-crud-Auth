import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './booking/booking.module';
import { PaymentModule } from './payment/payment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment/entities/payment.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [BookingModule, PaymentModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
    type: process.env.DB_TYPE as any,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
   // entities: [Payment],
    autoLoadEntities: true,
    synchronize: true,
  }),
    AuthModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
