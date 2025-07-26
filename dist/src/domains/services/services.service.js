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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const services_repository_1 = require("./repositories/services.repository");
let ServicesService = class ServicesService {
    serviceRepository;
    constructor(serviceRepository) {
        this.serviceRepository = serviceRepository;
    }
    async findAll() {
        return this.serviceRepository.findAll();
    }
    async findAllWithPagination(page, limit, search, filter) {
        const searchFields = ['name', 'description'];
        const { name } = filter || {};
        const where = {
            name,
        };
        return this.serviceRepository.findAllWithPagination(page, limit, search, searchFields, where);
    }
    async findById(id) {
        const service = await this.serviceRepository.findById(id);
        if (!service) {
            throw new common_1.NotFoundException('Service not found');
        }
        return service;
    }
    async create(createServiceDto) {
        const existingService = await this.serviceRepository.findByName(createServiceDto.name.toLowerCase());
        if (existingService) {
            throw new common_1.BadRequestException('Service already exists');
        }
        return this.serviceRepository.create({
            ...createServiceDto,
        });
    }
    async update(id, updateServiceDto) {
        await this.findById(id);
        return this.serviceRepository.update(id, updateServiceDto);
    }
    async delete(id) {
        await this.findById(id);
        await this.serviceRepository.delete(id);
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [services_repository_1.ServiceRepository])
], ServicesService);
//# sourceMappingURL=services.service.js.map