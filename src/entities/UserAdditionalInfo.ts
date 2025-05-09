import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { User } from './Users.js';

@Entity('user_additional_info')
export class UserInfo {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' }) // поле зовнішнього ключа
    user!: User;

    @Column({ type: 'text' })
    info!: string;
}
