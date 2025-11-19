# NestJS + Prisma Project Guidelines

## Architecture Overview

This is a **NestJS REST API** with **Prisma ORM** and **PostgreSQL**, following production-ready patterns with centralized error handling and validation.

### Key Structural Decisions

- **Custom Prisma Output Path**: Generated client lives in `generated/prisma/` (not default `node_modules`). Import from `generated/prisma`, not `@prisma/client`.
- **Centralized Response Format**: All endpoints use `ApiResponse<T>` interface with `success`, `message`, `data`, `timestamp` fields. Enforced by `ResponseInterceptor`.
- **Global Exception Handling**: `GlobalExceptionFilter` transforms Prisma errors (P2002 unique constraint) and Zod errors into consistent API responses.
- **Config Validation**: `app.config.ts` and `db.config.ts` use custom validation functions to validate environment variables at startup. App crashes early if required vars are missing.

## Development Workflow

```bash
# Development server with hot reload
npm run dev

# Database setup (Docker Postgres)
docker-compose up -d

# Prisma migrations
npx prisma migrate dev --name <description>  # Creates migration + regenerates client
npx prisma studio                             # Visual DB browser

# Build and production
npm run build
npm run start:prod
```

**Port**: App runs on port from `PORT` env var (default: 3000). API prefix: `/api/v1`. Swagger docs: `/api/v1/docs`.

## Critical Patterns

### 1. DTOs with Validation

Use `class-validator` decorators + `@Transform` for input sanitization:

```typescript
export class CreateUserDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsOptional()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  name?: string;
}
```

Global validation pipe config in `src/common/validators/validation-pipe.config.ts`:

- `whitelist: true` - strips unknown properties
- `forbidNonWhitelisted: true` - throws error if extra fields present
- `transform: true` - auto-converts types

### 2. Controller Response Pattern

Controllers return objects that match `ApiResponse<T>` structure. Don't throw custom response objects—return data and let interceptor/filters handle formatting:

```typescript
// ✅ Good - explicit response structure
return {
  success: true,
  message: 'User created successfully',
  data: user,
  timestamp: new Date().toISOString(),
};

// ✅ Also good - interceptor wraps plain data
return user; // Interceptor adds success/message/timestamp wrapper
```

### 3. Prisma Service Singleton

- `PrismaService` extends `PrismaClient` with lifecycle hooks (`onModuleInit`, `onModuleDestroy`)
- Registered in `AppModule` as global provider
- Import types from `generated/prisma`, e.g., `import { User } from 'generated/prisma/wasm'`

### 4. Error Handling

- **Prisma Errors**: Automatically caught by `GlobalExceptionFilter`. P2002 (unique constraint) returns 400 with field name.
- **Not Found**: Use `throw new NotFoundException('User not found')` for missing resources.
- **Validation**: Handled by ValidationPipe—returns 400 with detailed error array.

## Module Structure

New modules follow this pattern:

```
src/modules/<module-name>/
  ├── <module-name>.module.ts
  ├── <module-name>.controller.ts
  ├── <module-name>.service.ts
  └── dto/
      ├── create-<module-name>.dto.ts
      └── update-<module-name>.dto.ts
```

- Controllers use `@ApiTags()`, `@ApiOperation()`, `@ApiResponse()` for Swagger docs
- Services inject `PrismaService` for database operations
- Update DTOs extend Create DTOs using `PartialType` from `@nestjs/mapped-types`

## Testing

- HTTP tests in `http/` directory using REST Client format
- Validation test file (`user-validation-tests.http`) demonstrates edge cases for DTOs
- Test server typically runs on `http://localhost:8000` (check `PORT` env)

## Environment Variables

Required vars validated at startup via Zod schemas:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/db
PORT=8000
NODE_ENV=development
JWT_SECRET=minimum-16-characters
CORS_ORIGIN=http://localhost:3000
```

## Common Pitfalls

1. **Prisma Import Path**: Always use `generated/prisma`, never `@prisma/client`
2. **Forgotten Migrations**: After changing `schema.prisma`, run `npx prisma migrate dev`
3. **Response Format**: Controllers already have interceptor—don't manually wrap responses unless adding custom metadata
4. **Validation Messages**: Use custom messages in decorators for better UX (see `CreateUserDto` examples)
