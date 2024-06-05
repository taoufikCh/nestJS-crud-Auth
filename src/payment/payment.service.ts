import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';;

@Injectable()
export class PaymentService {

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
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

 

  

 
}
