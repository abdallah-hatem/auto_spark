import { applyDecorators } from '@nestjs/common';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

/**
 * Reusable email validation decorator
 * Combines required check and email format validation
 */
export function ValidateEmail() {
  return applyDecorators(
    IsNotEmpty({ message: 'Please input your email' }),
    IsEmail({}, { message: 'Please enter a valid email format' }),
  );
}

/**
 * Reusable password validation decorator
 * Validates password complexity requirements:
 * - Minimum 8 characters
 * - At least one letter
 * - At least one number
 * - At least one special character
 */
export function ValidatePassword() {
  return applyDecorators(
    IsNotEmpty({ message: 'Please input your password' }),
    MinLength(8, { message: 'Password must be at least 8 characters long' }),
    Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
      message:
        'Password must contain at least one letter, one number, and one special character',
    }),
  );
}

/**
 * Reusable name validation decorator
 * Validates name with minimum length requirement
 */
export function ValidateName(minLength: number = 3) {
  return applyDecorators(
    IsString(),
    IsNotEmpty({ message: 'Please input your name' }),
    MinLength(minLength, {
      message: `Name must be at least ${minLength} characters long`,
    }),
  );
}

/**
 * Basic required string validation
 */
export function ValidateRequiredString(fieldName: string) {
  return applyDecorators(
    IsString(),
    IsNotEmpty({ message: `Please input your ${fieldName}` }),
  );
}

export function ValidatePhone() {
  return applyDecorators(
    IsString(),
    IsNotEmpty({ message: 'Please input your phone number' }),
    Matches(/^(\+20|0020|20)?0?(10|11|12|15)[0-9]{8}$/, {
      message:
        'Please enter a valid Egyptian phone number (e.g., +201012345678, 01012345678)',
    }),
  );
}

import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return true; // Allow optional dates

          // Check if it's already a Date object or can be converted to one
          const inputDate = value instanceof Date ? value : new Date(value);
          
          // Check if the date is valid
          if (isNaN(inputDate.getTime())) {
            return false; // Invalid date
          }

          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(0, 0, 0, 0); // Start of tomorrow

          return inputDate >= tomorrow;
        },
        defaultMessage(args: ValidationArguments) {
          return 'Expiration date must be a valid date and at least tomorrow';
        },
      },
    });
  };
}
