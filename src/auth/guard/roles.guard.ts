// roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/auth/enums/role.enum';
import { HttpException, HttpStatus } from '@nestjs/common';
export const ROLES_KEY = 'roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    
    const roles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());
    
    if (!roles) {
      return true; // No roles specified, allow access
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];


    
    //const token = this.extractTokenFromHeader(request);

    //const user = this.jwtService.verify(token);
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: `${process.env.SECRET_KEY}`
        }
      );
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
      if (!request['user'].roles || !roles.some(role => request['user'].roles.includes(role))) {
        throw new HttpException('Forbidden resource. Insufficient roles.', HttpStatus.FORBIDDEN);
      }
    } catch (e){
      Logger.error(e.message);
      throw new UnauthorizedException();
    }
    
    /*if (!user.roles || !roles.some(role => user.roles.includes(role))) {
      throw new HttpException('Forbidden resource. Insufficient roles.', HttpStatus.FORBIDDEN);
    }*/

    return true;
  }
 
  
}



/*@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  matchRoles(roles: string[], userRole: string) {
    return roles.some((role) => role === userRole);
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return this.matchRoles(roles, user.role);
  }
}
*/
    
  

/*@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler()
        //context.getClass(),
    //]
);
    //const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      console.log("roles ",roles)
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return false;
    }

    const user = this.jwtService.verify(token);
    return roles.some(role => user.roles?.includes(role));
  }
}
*/