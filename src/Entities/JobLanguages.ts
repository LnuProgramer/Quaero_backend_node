import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { Vacancy } from './JobVacancies.js';

@Entity('job_languages')
export class VacancyLanguage {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToMany(() => VacancyLanguage, (language) => language.vacancy)
    languages!: VacancyLanguage[];
    @JoinColumn({ name: 'vacancy_id' })
    vacancy!: Vacancy;

    @Column({ name: 'language_name', type: 'varchar', length: 100 })
    languageName!: string;

    @Column({ name: 'language_level', type: 'varchar', length: 100 })
    languageLevel!: string;
}
