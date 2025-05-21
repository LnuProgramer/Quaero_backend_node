var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryColumn, Column, } from 'typeorm';
let MlModel = class MlModel {
};
__decorate([
    PrimaryColumn(),
    __metadata("design:type", Number)
], MlModel.prototype, "id", void 0);
__decorate([
    Column({ name: 'model_json', type: 'longtext' }),
    __metadata("design:type", String)
], MlModel.prototype, "modelJson", void 0);
__decorate([
    Column({ name: 'weight_bin_base64', type: 'longtext' }),
    __metadata("design:type", String)
], MlModel.prototype, "weightBinBase64", void 0);
__decorate([
    Column({ name: 'pages', type: `simple-json` }),
    __metadata("design:type", Array)
], MlModel.prototype, "pages", void 0);
MlModel = __decorate([
    Entity({ name: 'ml_model' })
], MlModel);
export { MlModel };
//# sourceMappingURL=MLModel.js.map