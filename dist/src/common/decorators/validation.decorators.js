"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateEmail = ValidateEmail;
exports.ValidatePassword = ValidatePassword;
exports.ValidateName = ValidateName;
exports.ValidateRequiredString = ValidateRequiredString;
exports.ValidatePhone = ValidatePhone;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
function ValidateEmail() {
    return (0, common_1.applyDecorators)((0, class_validator_1.IsNotEmpty)({ message: 'Please input your email' }), (0, class_validator_1.IsEmail)({}, { message: 'Please enter a valid email format' }));
}
function ValidatePassword() {
    return (0, common_1.applyDecorators)((0, class_validator_1.IsNotEmpty)({ message: 'Please input your password' }), (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters long' }), (0, class_validator_1.Matches)(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
        message: 'Password must contain at least one letter, one number, and one special character'
    }));
}
function ValidateName(minLength = 3) {
    return (0, common_1.applyDecorators)((0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)({ message: 'Please input your name' }), (0, class_validator_1.MinLength)(minLength, { message: `Name must be at least ${minLength} characters long` }));
}
function ValidateRequiredString(fieldName) {
    return (0, common_1.applyDecorators)((0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)({ message: `Please input your ${fieldName}` }));
}
function ValidatePhone() {
    return (0, common_1.applyDecorators)((0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)({ message: 'Please input your phone number' }), (0, class_validator_1.Matches)(/^(\+20|0020|20)?0?(10|11|12|15)[0-9]{8}$/, {
        message: 'Please enter a valid Egyptian phone number (e.g., +201012345678, 01012345678)'
    }));
}
//# sourceMappingURL=validation.decorators.js.map