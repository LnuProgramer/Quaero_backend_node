var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, } from 'typeorm';
let VacancyLanguage = class VacancyLanguage {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], VacancyLanguage.prototype, "id", void 0);
__decorate([
    ManyToOne('Vacancy', 'languages', { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'vacancy_id' }),
    __metadata("design:type", Object)
], VacancyLanguage.prototype, "vacancy", void 0);
__decorate([
    Column({ name: 'language_name', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], VacancyLanguage.prototype, "languageName", void 0);
__decorate([
    Column({ name: 'language_level', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], VacancyLanguage.prototype, "languageLevel", void 0);
VacancyLanguage = __decorate([
    Entity('job_languages')
], VacancyLanguage);
export { VacancyLanguage };
//# sourceMappingURL=JobLanguages.js.map