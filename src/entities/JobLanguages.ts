import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

@Entity('job_languages')
export class VacancyLanguage {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne('Vacancy', 'languages', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'vacancy_id' })
    vacancy!: any; // або Vacancy, якщо тип вже доступний

    @Column({ name: 'language_name', type: 'varchar', length: 100 })
    languageName!: string;

    @Column({ name: 'language_level', type: 'varchar', length: 100 })
    languageLevel!: string;
}
