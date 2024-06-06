import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { RefreshToken } from './entities/refresh-token.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailService } from 'src/services/mail.service';
//import { JwtStrategy } from './strategies/jwt.strategy';
//import { JwtStrategy } from './jwt.strategy';

@Module({
  imports:[TypeOrmModule.forFeature([User, RefreshToken]),
  //PassportModule,
 // PassportModule.register({ defaultStrategy: 'jwt' }),
 /* JwtModule.register({
    secret:`${process.env.SECRET_KEY}`,
    signOptions: { expiresIn: `${process.env.EXPIRES_IN}` },
  }),*/
  //RefreshTokenRepository
  PassportModule,
    JwtModule.register({
      secret: `${process.env.SECRET_KEY}`,
      signOptions: { expiresIn: '1h' },
    }),
],
  controllers: [AuthController],
  providers: [AuthService, MailService
   // JwtStrategy, LocalStrategy
  ], // LocalStrategy,JwtStrategy
//exports: [AuthService,],// PassportModule, JwtModule
})

export class AuthModule {}
