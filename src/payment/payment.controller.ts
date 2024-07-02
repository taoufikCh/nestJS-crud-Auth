import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Response } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService
  ) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }
 //@Roles('admin')

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  findAll() {
    return this.paymentService.findAll();
  }
  
  //@Roles(Role.Admin)
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
  //@UseGuards(JwtAuthGuard)
  @Get('paymentList1')
  async getPaymentListPdf() {
    console.log("ici")
    //await this.paymentService.getPaymentListPdf(res);
    return {message :"test ok"};
  }

  /*@Get('generatePDF')
  async generatePDF() {
    console.log("zzzz");
    console.log("ici")
    const res = await this.paymentService.generatePDF();
    return res;
  }*/

  
  
}
