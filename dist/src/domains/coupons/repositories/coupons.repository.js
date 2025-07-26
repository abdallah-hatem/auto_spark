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
exports.CouponRepository = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../../database/database.service");
const base_repository_1 = require("../../../common/repositories/base.repository");
let CouponRepository = class CouponRepository extends base_repository_1.BaseRepository {
    constructor(databaseService) {
        super(databaseService, 'coupon');
    }
    async findByCode(code) {
        return this.model.findFirst({
            where: { code },
        });
    }
    async findActiveCoupons() {
        return this.model.findMany({
            where: {
                isActive: true,
                OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
            },
        });
    }
    async incrementUsage(id) {
        return this.model.update({
            where: { id },
            data: {
                uses: {
                    increment: 1,
                },
            },
        });
    }
};
exports.CouponRepository = CouponRepository;
exports.CouponRepository = CouponRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], CouponRepository);
//# sourceMappingURL=coupons.repository.js.map