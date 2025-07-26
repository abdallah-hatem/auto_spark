"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryParams = void 0;
const common_1 = require("@nestjs/common");
exports.QueryParams = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;
    const page = Number(query.page) || 1;
    const limit = Math.min(Number(query.limit) || 10, 50);
    const search = query.search;
    if (page < 1) {
        throw new common_1.BadRequestException('Page must be greater than 0');
    }
    if (limit < 1) {
        throw new common_1.BadRequestException('Limit must be greater than 0');
    }
    const filters = {};
    Object.keys(query).forEach((key) => {
        const match = key.match(/^filter\[(.+)\]$/);
        if (match) {
            const filterKey = match[1];
            let filterValue = query[key];
            if (filterValue === 'true')
                filterValue = true;
            else if (filterValue === 'false')
                filterValue = false;
            else if (!isNaN(Number(filterValue)))
                filterValue = Number(filterValue);
            filters[filterKey] = filterValue;
        }
    });
    return {
        page,
        limit,
        search,
        filters,
    };
});
//# sourceMappingURL=query-params.decorator.js.map