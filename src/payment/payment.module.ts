import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
  imports:[TypeOrmModule.forFeature([Payment]), 
  JwtModule.register({
    secret:`${process.env.SECRET_KEY}`,
    signOptions: { expiresIn: process.env.EXPIRES_IN },
  }),],
  controllers: [PaymentController],
  providers: [PaymentService,JwtStrategy
   /* {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },*/
  ],
})
export class PaymentModule {}
