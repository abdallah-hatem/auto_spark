"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsAdmin = exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = require("@nestjs/common");
const user_enum_1 = require("../../../common/enums/user.enum");
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;
const IsAdmin = () => (0, common_1.SetMetadata)(exports.ROLES_KEY, [user_enum_1.UserRole.ADMIN]);
exports.IsAdmin = IsAdmin;
//# sourceMappingURL=roles.decorator.js.map