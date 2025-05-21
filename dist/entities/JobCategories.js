var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Vacancy } from './JobVacancies.js';
let JobCategory = class JobCategory {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], JobCategory.prototype, "id", void 0);
__decorate([
    Column({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], JobCategory.prototype, "name", void 0);
__decorate([
    OneToMany(() => Vacancy, (vacancy) => vacancy.category),
    __metadata("design:type", Array)
], JobCategory.prototype, "vacancies", void 0);
JobCategory = __decorate([
    Entity('job_categories')
], JobCategory);
export { JobCategory };
//# sourceMappingURL=JobCategories.js.map