"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationValidationPipe = void 0;
const common_1 = require("@nestjs/common");
let PaginationValidationPipe = class PaginationValidationPipe extends common_1.ValidationPipe {
    constructor() {
        super({
            whitelist: true,
            forbidNonWhitelisted: false,
            transform: true,
            skipMissingProperties: false,
        });
    }
    async transform(value, metadata) {
        if (metadata.type === 'query') {
            const filteredValue = { ...value };
            Object.keys(filteredValue).forEach(key => {
                if (key.match(/^filter\[.+\]$/)) {
                    delete filteredValue[key];
                }
            });
            return super.transform(filteredValue, metadata);
        }
        return super.transform(value, metadata);
    }
};
exports.PaginationValidationPipe = PaginationValidationPipe;
exports.PaginationValidationPipe = PaginationValidationPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PaginationValidationPipe);
//# sourceMappingURL=pagination-validation.pipe.js.map