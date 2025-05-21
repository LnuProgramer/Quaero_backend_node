var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne, CreateDateColumn, } from 'typeorm';
import { JobCategory } from './JobCategories.js';
import { EmploymentType } from './EmploymentTypes.js';
import { User } from './Users.js';
import { VacancyLanguage } from './JobLanguages.js';
let Vacancy = class Vacancy {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Vacancy.prototype, "id", void 0);
__decorate([
    Column({ name: 'company_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Vacancy.prototype, "companyName", void 0);
__decorate([
    Column({ name: 'position_title', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Vacancy.prototype, "positionTitle", void 0);
__decorate([
    Column({ type: 'text' }),
    __metadata("design:type", String)
], Vacancy.prototype, "description", void 0);
__decorate([
    Column({ type: 'int' }),
    __metadata("design:type", Number)
], Vacancy.prototype, "salary", void 0);
__decorate([
    Column({ name: 'years_of_experience', type: 'int' }),
    __metadata("design:type", Number)
], Vacancy.prototype, "yearsOfExperience", void 0);
__decorate([
    CreateDateColumn({ name: 'date_posted' }),
    __metadata("design:type", Date)
], Vacancy.prototype, "datePosted", void 0);
__decorate([
    ManyToOne(() => JobCategory),
    JoinColumn({ name: 'category_id' }),
    __metadata("design:type", JobCategory)
], Vacancy.prototype, "category", void 0);
__decorate([
    ManyToOne(() => EmploymentType),
    JoinColumn({ name: 'employment_type_id' }),
    __metadata("design:type", EmploymentType)
], Vacancy.prototype, "employmentType", void 0);
__decorate([
    ManyToOne(() => User),
    JoinColumn({ name: 'user_id' }),
    __metadata("design:type", User)
], Vacancy.prototype, "user", void 0);
__decorate([
    OneToMany(() => VacancyLanguage, (language) => language.vacancy),
    __metadata("design:type", Array)
], Vacancy.prototype, "languages", void 0);
Vacancy = __decorate([
    Entity('job_vacancies')
], Vacancy);
export { Vacancy };
//# sourceMappingURL=JobVacancies.js.map