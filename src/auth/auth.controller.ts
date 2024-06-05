import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpData: SignupDto){
    return this.authService.singup(signUpData);
  }

  @Post('signin')
  async login(@Body() credentials: SigninDto){
   // return this.authService.singup(signUpData);
  }
}
