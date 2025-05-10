import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    JoinColumn,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import { JobCategory } from './JobCategories.js';
import { EmploymentType } from './EmploymentTypes.js';
import { User } from './Users.js';
import { VacancyLanguage } from './JobLanguages.js';

@Entity('job_vacancies')
export class Vacancy {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'company_name', type: 'varchar', length: 255 })
    companyName!: string;

    @Column({ name: 'position_title', type: 'varchar', length: 255 })
    positionTitle!: string;

    @Column({ type: 'text' })
    description!: string;

    @Column({ type: 'int' })
    salary!: number;

    @Column({ name: 'years_of_experience', type: 'int' })
    yearsOfExperience!: number;

    @CreateDateColumn({ name: 'date_posted' })
    datePosted!: Date;

    @ManyToOne(() => JobCategory)
    @JoinColumn({ name: 'category_id' })
    category!: JobCategory;

    @ManyToOne(() => EmploymentType)
    @JoinColumn({ name: 'employment_type_id' })
    employmentType!: EmploymentType;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @OneToMany(() => VacancyLanguage, (language) => language.vacancy)
    languages!: VacancyLanguage[];
}
