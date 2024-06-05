import { Injectable } from '@nestjs/common';

@Injectable()
export class BookingService {
    getBooking():string{
        return "List of booking :) ";
      }
}
