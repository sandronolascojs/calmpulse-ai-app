import { z } from 'zod';

// create name validation for zod schema validating all valid names
export const MAX_NAME_LENGTH = 50;
export const NAME_REGEX = new RegExp('^[a-zA-Z0-9\\s]+$');
export const EMAIL_REGEX = new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$');
export const PASSWORD_REGEX = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$',
);
export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 62;

export const nameValidation = (fieldName: string) => {
  return z
    .string()
    .min(1, {
      message: `${fieldName} is required`,
    })
    .max(MAX_NAME_LENGTH, {
      message: `${fieldName} must be less than ${MAX_NAME_LENGTH.toString()} characters`,
    })
    .regex(NAME_REGEX, {
      message: 'Name must contain only letters, numbers, and spaces',
    });
};

export const emailValidation = z
  .string()
  .min(1, {
    message: 'Email is required',
  })
  .regex(EMAIL_REGEX, {
    message: 'Invalid email address',
  });

export const passwordValidation = z
  .string()
  .min(PASSWORD_MIN_LENGTH, {
    message: 'Password is required',
  })
  .max(PASSWORD_MAX_LENGTH, {
    message: `Password must be less than ${PASSWORD_MAX_LENGTH.toString()} characters`,
  })
  .regex(PASSWORD_REGEX, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  });
