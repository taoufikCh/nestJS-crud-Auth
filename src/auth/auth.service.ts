import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository :Repository<User>
    ){}

    async singup(signupDto: SignupDto,  roles: string[] = ['user']): Promise<User>
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
}
