import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { SignupDto } from './dtos/signup.dto';
import * as bcrypt from 'bcrypt';
import { SigninDto } from './dtos/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './entities/refresh-token.entity';
import { v4 as uuidv4 } from 'uuid';
import { Role } from './enums/role.enum';
import {MailService} from '../services/mail.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository :Repository<User>,
        private jwtService: JwtService,
        @InjectRepository(RefreshToken)
        private refreshTokenRepository: Repository<RefreshToken>,

        private emailService : MailService,
    ){}

    async singup(signupDto: SignupDto,  roles: Role[] = [Role.Admin]): Promise<User>
    {
        const { name, email, password } = signupDto;
        const emailInUse =  await this.userRepository.findOneBy({
            email : email
        })
        if(emailInUse){
            throw new BadRequestException('Email already in use');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({ name, email, password: hashedPassword, roles });
  
        const res = await this.userRepository.save(user);
        return res;
    }

    async signin(credentials: SigninDto): Promise<any>
    {
        const { email, password } = credentials;
        const user =  await this.userRepository.findOneBy({
            email,
        })
        if(!user){
            throw new UnauthorizedException('this email is not associated with any account');
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch){
                throw new UnauthorizedException('Password incorrect');
        } 
        if(!user.isActive){
            throw new UnauthorizedException('Your account is Blocked');
        } 
        
        return this.generateUserTokens(user);
        //return { message :"Success"};
    }

   
    
      async login(user: any) {
        return this.generateUserTokens(user);
      }

     

    async generateUserTokens(user){
        //const accessToken = this.jwtService.sign({})
        const payload = { name: user.email, sub: user.id, roles: user.roles };
        const refreshToken = await this.createRefreshToken(user);
            return {
                access_token: this.jwtService.sign(payload, { secret: `${process.env.SECRET_KEY}` }),
                refresh_token: refreshToken.token,
            };
    }

    async createRefreshToken(user: User): Promise<RefreshToken> {
        const token = uuidv4();
        const refreshToken = this.refreshTokenRepository.create({
          token,
          isValid: true,
          expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          user: user,
        });
        return this.refreshTokenRepository.save(refreshToken);
      }

      async refreshTokens( refreshToken: string) {
        const existingToken = await this.refreshTokenRepository.findOne({
          where: { token: refreshToken, isValid: true, expiresIn: MoreThanOrEqual(new Date()) },
          relations: ['user'],
        });
    
        if (!existingToken || existingToken.expiresIn < new Date()) {
          throw new UnauthorizedException('Invalid refresh token');
        }
    
        existingToken.isValid = false;
        await this.refreshTokenRepository.save(existingToken);
    
       const newAccessToken =  await this.generateUserTokens(existingToken.user);
        
    
        return  newAccessToken;
      }

      async changePassword(userId, oldPassword: string, newPassword: string) {
        //Find the user
        const user = await this.userRepository.findOneBy({id :userId});
        if (!user) {
          throw new NotFoundException('User not found...');
        }
        console.log(`Validating payload: ${JSON.stringify(user)}`);
        //Compare the old password with the password in DB
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
          throw new UnauthorizedException('Wrong credentials');
        }
    
        //Change user's password
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = newHashedPassword;
        await this.userRepository.save(user);
        return "Password updated ! ";
      }

      async resetPassword(email: string): Promise<void> {
        const user = await this.userRepository.findOneBy({ email });
        if (user) {
         
    
        const newPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await this.userRepository.save(user);
    
        await this.emailService.sendPasswordResetEmail(user.email, newPassword);
          
      }
      
    }

     /* async validateUser(credentials: SigninDto): Promise<any> {
        const { email, password } = credentials;
        const user =  await this.userRepository.findOneBy({
            email,
        })
        if(!user){
            throw new UnauthorizedException('this email is not associated with any account');
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch){
                throw new UnauthorizedException('Password incorrect');
        } 
        if(!user.isActive){
            throw new UnauthorizedException('Your account is Blocked');
        } 
        console.log('User validated successfully');
        
        return user;
      }*/

   
}
