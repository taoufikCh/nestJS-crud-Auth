import { Entity, Column,CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    customer: string;
    @Column()
    staff: string;
    @Column()
    type: string;
    @Column()
    amount: number;
    @CreateDateColumn({ type: 'timestamp' })
    payment_date: Date;
    @Column()
    last_update: Date;
    @Column({ default: false })
    isBlocked: boolean;
  
    
}
