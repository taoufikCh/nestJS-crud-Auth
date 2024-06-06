import { Controller, Post, Body, Req, UseGuards, Request, Res, HttpStatus, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { SigninDto } from './dtos/signin.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { AuthGuard } from './guard/auth.guard';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
//import { LocalAuthGuard } from './guard/local-auth.guard';
//import { AuthGuard } from '@nestjs/passport';

//@UseGuards(LocalAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpData: SignupDto){
    return this.authService.singup(signUpData);
  }

 // @UseGuards(AuthGuard('local'))
  @Post('signin')
  async signin(@Body() credentials: SigninDto){
    console.log("signin ");
    return this.authService.signin(credentials);
    
   /* try {
      const response = this.authService.signin(credentials);
      return res.status(HttpStatus.OK).json({ response });
    } catch (error) {
      return res.status(error.status).json(error.response);
    }*/
  }


  @UseGuards(JwtAuthGuard) // Ensure JwtAuthGuard is used for routes that require JWT authentication
  @Post('protected')
  getProtectedResource(@Request() req) {
    return { message: 'This is a protected resource', user: req.user };
  }
  

  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }

  @UseGuards(AuthGuard)
  @Put('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto,@Req() req)
   {
    return this.authService.changePassword(
      req.userId,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }
  @Post('reset-password')
  async resetPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.resetPassword(forgotPasswordDto.email);
    //return { message: 'A new password has been sent to your email.' };
    return { message: 'If this user exists, A new password will be sent to your email' };
  }

}
