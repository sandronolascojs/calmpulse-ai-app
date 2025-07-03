import { z } from 'zod';

// create name validation for zod schema validating all valid names
export const MAX_NAME_LENGTH = 50;
export const NAME_REGEX = /^[a-zA-Z0-9\s]+$/;
export const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 62;

export const nameValidation = z
  .string()
  .min(1, {
    message: 'Name is required',
  })
  .max(MAX_NAME_LENGTH, {
    message: `Name must be less than ${MAX_NAME_LENGTH} characters`,
  })
  .regex(NAME_REGEX, {
    message: 'Name must contain only letters, numbers, and spaces',
  });

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
    message: `Password must be less than ${PASSWORD_MAX_LENGTH} characters`,
  })
  .regex(PASSWORD_REGEX, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  });
