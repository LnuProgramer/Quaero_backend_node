import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from 'typeorm';

@Entity({ name: 'page_transition' })
export class PageTransition {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'from', type: 'longtext' })
    from!: string;

    @Column({ name: 'to', type: 'longtext' })
    to!: string;
}