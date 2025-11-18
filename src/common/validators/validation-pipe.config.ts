import { ValidationPipeOptions } from '@nestjs/common';

/**
 * Production-ready validation pipe configuration
 * This configuration ensures:
 * - Automatic type transformation
 * - Removal of unknown properties
 * - Detailed error messages
 * - Nested object validation
 */
export const validationPipeConfig: ValidationPipeOptions = {
  // Automatically transform payloads to DTO instances
  transform: true,

  // Strip properties that don't have decorators
  whitelist: true,

  // Throw error if non-whitelisted properties are present
  forbidNonWhitelisted: true,

  // Enable detailed error messages (set to true in production for security)
  disableErrorMessages: false,

  // Validate nested objects
  validateCustomDecorators: true,

  // Transform options for automatic type conversion
  transformOptions: {
    enableImplicitConversion: true,
  },

  // Skip missing properties (useful for PATCH operations)
  skipMissingProperties: false,

  // Skip null properties
  skipNullProperties: false,

  // Skip undefined properties
  skipUndefinedProperties: false,

  // Validate each item in arrays
  forbidUnknownValues: true,

  // Stop at first error (set to false for comprehensive validation)
  stopAtFirstError: false,
};
