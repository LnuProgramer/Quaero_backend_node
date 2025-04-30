import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn
} from 'typeorm';
import { User } from './Users.js';

@Entity('user_additional_info')
export class UserInfo {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' }) // поле зовнішнього ключа
    user!: User;

    @Column({ type: 'text' })
    info!: string;
}
