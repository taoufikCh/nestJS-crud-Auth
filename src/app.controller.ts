import { Body, Controller, Get, Param, Post, Query,Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("/test")
  saveData(@Query() query) {
    return query.name;
    return query;
    //return this.appService.getHello();
  }
  @Post("/test2")
  postData(@Query('name') username) {
    return username;
  }

  @Post("/test/:name")
  postData2(@Param() params) {
    return params;
  }

  @Post("/postBody")
  postBody(@Body() body) {
    return body;
  }
  @Post("/postName")
  welcome(@Body('name') username:string) {
    return this.appService.welcome(username);
  }

  @Post("/ReqRes")
  ReqReS(@Body('name') username:string,@Req() req,@Res()res) { //Req : request, Res:response
    //return this.appService.welcome(username);
    //res.send(this.appService.welcome(username));
    res.send(req.body);
  }
}
