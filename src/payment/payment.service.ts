import { Injectable, Res } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PdfService } from 'src/services/pdf.service';
//import { Response } from 'supertest';
import { Response } from 'express';

@Injectable()
export class PaymentService {

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private pdfService: PdfService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
   const res = await this.paymentRepository.save(createPaymentDto);
   return res;
  }



  findAll(): Promise<Payment[]> {
    return this.paymentRepository.find();
  }

  async findOne(id: number) : Promise<Payment | null>{
    const res = await this.paymentRepository.findOneBy({ id: id })
    return res;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    //return `This action updates a #${id} payment`;
    const payment = await this.paymentRepository.findOneBy({ id: id });
    if (!payment) {
      
      throw new Error(`Payment with id ${id} not found`);
    }
      payment.customer = updatePaymentDto.customer;
      payment.staff= updatePaymentDto.staff;
      payment.type= updatePaymentDto.type;
      payment.amount= updatePaymentDto.amount;
    const updatePayemt = await this.paymentRepository.save(payment);
      return updatePayemt;
    
  }

  async remove(id: number){
    const res =  await this.paymentRepository.delete(id);
    return res;
  }

  async getPaymentListPdf(@Res() res) {
  
   
  }
  
  /*async generatePDF() {
    console.log("zzzz");
    const students = [
      { name: 'John Doe', age: 25 },
      { name: 'Jane Smith', age: 22 },
      { name: 'Bob Johnson', age: 30 },
    ];
    const filePath = 'C:/Users/Taoufik/Documents/students.pdf';

    this.pdfService.generateStudentListPDF(students, filePath);
  }*/

 
   /* async getStudentsPdf( ) {
      const filePath = await this.pdfService.generatePdfStream(this.getMockStudents());
      return filePath;
  }*/

  private getMockStudents() {
      return [
          { id: 1, name: 'John Doe', age: 20, grade: 'A' },
          { id: 2, name: 'Jane Doe', age: 22, grade: 'B' },
          { id: 3, name: 'Jim Beam', age: 21, grade: 'C' },
      ];
  }
  

 
}
