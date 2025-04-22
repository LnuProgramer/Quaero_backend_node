import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Vacancy } from './JobVacancies.js';

@Entity('employment_types')
export class EmploymentType {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 100 })
    type!: string;

    @OneToMany(() => Vacancy, (vacancy) => vacancy.employmentType)
    vacancies!: Vacancy[];
}
