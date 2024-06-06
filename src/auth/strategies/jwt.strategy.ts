// src/auth/jwt.strategy.ts
import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

//import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    private readonly logger = new Logger(JwtStrategy.name);
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:process.env.SECRET_KEY,// `${process.env.SECRET_KEY}`,
    });
    this.logger.log('JwtStrategy initialized');
  }

  async validate(payload: any) {
    console.log('Inside JWT Strategy Validate');
   // this.logger.log(`Validating payload: ${JSON.stringify(payload)}`);
    return { id: payload.sub, email: payload.name, role: payload.roles };
  }

}