import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Vacancy } from './JobVacancies.js';

@Entity('job_categories')
export class JobCategory {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 100 })
    name!: string;

    @OneToMany(() => Vacancy, (vacancy) => vacancy.category)
    vacancies!: Vacancy[];
}
