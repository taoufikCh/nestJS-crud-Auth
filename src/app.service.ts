import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  welcome(name:string):string{
    return "welcome to : "+name;
  }
}
