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
let EmploymentType = class EmploymentType {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], EmploymentType.prototype, "id", void 0);
__decorate([
    Column({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], EmploymentType.prototype, "type", void 0);
__decorate([
    OneToMany(() => Vacancy, (vacancy) => vacancy.employmentType),
    __metadata("design:type", Array)
], EmploymentType.prototype, "vacancies", void 0);
EmploymentType = __decorate([
    Entity('employment_types')
], EmploymentType);
export { EmploymentType };
//# sourceMappingURL=EmploymentTypes.js.map