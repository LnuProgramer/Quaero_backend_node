var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, } from 'typeorm';
let PageTransition = class PageTransition {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], PageTransition.prototype, "id", void 0);
__decorate([
    Column({ name: 'from', type: 'longtext' }),
    __metadata("design:type", String)
], PageTransition.prototype, "from", void 0);
__decorate([
    Column({ name: 'to', type: 'longtext' }),
    __metadata("design:type", String)
], PageTransition.prototype, "to", void 0);
PageTransition = __decorate([
    Entity({ name: 'page_transition' })
], PageTransition);
export { PageTransition };
//# sourceMappingURL=PageTransition.js.map