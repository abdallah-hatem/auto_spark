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
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const booking_repository_1 = require("./repositories/booking.repository");
const notifications_service_1 = require("../notifications/notifications.service");
const users_service_1 = require("../users/users.service");
const client_1 = require("@prisma/client");
let BookingService = class BookingService {
    bookingRepository;
    notificationsService;
    usersService;
    constructor(bookingRepository, notificationsService, usersService) {
        this.bookingRepository = bookingRepository;
        this.notificationsService = notificationsService;
        this.usersService = usersService;
    }
    async createBooking(createBookingDto) {
        const washers = await this.usersService.findAllWithPagination({
            page: 1,
            limit: 20,
            role: client_1.UserRole.WASHER,
        });
        console.log(washers.data, 'washers');
        await this.notificationsService.sendToMultipleUsers({
            userIds: washers.data.map((washer) => washer.id),
            title: 'New booking',
            body: 'A new booking has been created',
        });
    }
    async findAllBookingsWithPagination(query) {
        const searchFields = [
            'customerId',
            'washerId',
            'serviceId',
            'couponId',
            'status',
            'scheduledAt',
            'lat',
            'lng',
            'address',
            'price',
            'originalPrice',
            'paymentId',
            'reviewId',
        ];
        const {} = query;
        return this.bookingRepository.findAllWithPagination(query.page, query.limit, query.search, searchFields, {});
    }
    async findBookingById(id) {
        const booking = await this.bookingRepository.findById(id);
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        return booking;
    }
    async updateBooking(id, updateBookingDto) {
        return this.bookingRepository.update(id, updateBookingDto);
    }
    async deleteBooking(id) {
        return this.bookingRepository.delete(id);
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [booking_repository_1.BookingRepository,
        notifications_service_1.NotificationsService,
        users_service_1.UsersService])
], BookingService);
//# sourceMappingURL=booking.service.js.map