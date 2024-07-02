import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    Logger,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Observable } from 'rxjs';
  import { Request } from 'express';
  
  //@Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
  
    async  canActivate(
      context: ExecutionContext,
    ):  Promise<boolean>{
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
  
      if (!token) {
        throw new UnauthorizedException('Invalid token');
      }
  
      try {
        const payload = await this.jwtService.verifyAsync(
            token,
            {
              secret: `${process.env.SECRET_KEY}`
            }
        );
        //Logger.error("payload "+payload);
       // Logger.log(`Validating payload: ${JSON.stringify(payload)}`);
        request.userId = payload.sub;
        //Logger.error("request.userId "+request.userId);
      } catch (e) {
        Logger.error(e.message);
        throw new UnauthorizedException('Invalid Token');
      }
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      return request.headers.authorization?.split(' ')[1];
    }
  }