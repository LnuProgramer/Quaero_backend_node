import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn({ name: 'date_of_registration' })
    dateOfRegistration!: Date;

    @Column({ type: 'varchar', length: 20, nullable: true })
    phone!: number | null;

    @Column({ name: 'first_name', type: 'varchar', length: 255 })
    firstName!: string;

    @Column({ name: 'last_name', type: 'varchar', length: 255 })
    lastName!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    city!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    country!: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email!: string;

    @Column({ name: 'company_name', type: 'varchar', length: 255, nullable: true })
    companyName!: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    position!: string;

    @Column({ type: 'varchar', length: 255 })
    password!: string;

    @Column({ name: 'image_data', type: 'uuid', nullable: true })
    imageData!: string | null;

    @Column({ type: 'varchar', length: 50 })
    role!: string;

    @Column({ type: 'text', nullable: true })
    description!: string | null;
}
