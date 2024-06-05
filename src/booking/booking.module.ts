import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';

@Module({
    imports:[],
    controllers:[BookingController],
    providers:[BookingService],
    exports:[],

})
export class BookingModule {}
