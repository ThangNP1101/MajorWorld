# Authentication Setup Guide

## 🎯 Overview

JWT-based authentication has been successfully implemented for the MajorWorld backend following NestJS best practices.

## 📁 Project Structure

```
src/modules/auth/
├── auth.module.ts              # Auth module configuration
├── auth.controller.ts          # Login & profile endpoints
├── auth.service.ts             # Business logic (validate, login)
├── strategies/
│   └── jwt.strategy.ts         # Passport JWT strategy
├── guards/
│   └── jwt-auth.guard.ts       # JWT authentication guard
├── decorators/
│   ├── current-user.decorator.ts  # @CurrentUser() decorator
│   └── public.decorator.ts        # @Public() decorator
├── dto/
│   ├── login.dto.ts
│   └── auth-response.dto.ts
└── entities/
    └── user.entity.ts          # User entity (admin, super_admin)
```

## 🚀 Setup Instructions

### 1. Environment Variables

Add these to your `.env` file:

```env
# JWT Configuration
JWT_SECRET=majorworld-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

### 2. Run Migration

```bash
cd apps/backend
npm run migration:run
```

This creates the `users` table with:
- `id` (primary key)
- `email` (unique)
- `password` (hashed with bcrypt)
- `name`
- `role` (admin, super_admin)
- `is_active`
- `created_at`, `updated_at`

### 3. Seed Default Admin User

```bash
npm run seed:run
```

**Default Credentials:**
- Email: `admin@majorworld.com`
- Password: `admin123`

⚠️ **IMPORTANT:** Change this password in production!

## 📡 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/login` | ❌ Public | Login with email/password |
| `GET` | `/api/auth/me` | ✅ Required | Get current user profile |

### Login Request

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@majorworld.com",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@majorworld.com",
    "name": "Admin User",
    "role": "super_admin",
    "isActive": true,
    "createdAt": "2024-01-14T10:00:00.000Z"
  }
}
```

### Get Profile Request

```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🔒 Protected Routes

### Global Guard

All routes are protected by default via `JwtAuthGuard` (configured in `app.module.ts`).

### Public Routes

Routes marked with `@Public()` decorator bypass authentication:

```typescript
@Public()
@Get('config')
async getConfig() {
  // This route is accessible without authentication
}
```

**Currently Public Routes:**
- `/api/auth/login` - Login endpoint
- `/api/v1/app/*` - All mobile API routes

### Admin Routes (Protected by Default)

All admin routes require authentication:
- `/api/admin/push-messages/*`
- `/api/admin/bottom-menu/*`
- `/api/admin/app-config/*`
- etc.

## 🛠️ Usage in Controllers

### Get Current User

Use the `@CurrentUser()` decorator:

```typescript
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';

@Get('profile')
async getProfile(@CurrentUser() user: User) {
  console.log(user.email, user.role);
  return user;
}
```

### Mark Route as Public

Use the `@Public()` decorator:

```typescript
import { Public } from '../auth/decorators/public.decorator';

@Public()
@Get('public-data')
async getPublicData() {
  return { message: 'This is accessible without auth' };
}
```

### Apply to Entire Controller

```typescript
@Public()
@Controller('public')
export class PublicController {
  // All routes in this controller are public
}
```

## 👥 User Roles

### Available Roles

```typescript
enum UserRole {
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}
```

### Role-Based Authorization (Optional)

To implement role-based guards later:

```typescript
// Create a roles decorator
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);

// Create a roles guard
@Injectable()
export class RolesGuard implements CanActivate {
  // Check if user has required role
}

// Usage in controller
@Roles(UserRole.SUPER_ADMIN)
@Delete(':id')
async deleteUser() {
  // Only super admins can access
}
```

## 🧪 Testing

### Test Login

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@majorworld.com","password":"admin123"}'

# Save the accessToken from response

# Test protected endpoint
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Swagger UI

Visit: `http://localhost:3001/api`

1. Login via `/api/auth/login`
2. Copy the `accessToken`
3. Click "Authorize" button (🔓 icon)
4. Enter: `Bearer YOUR_ACCESS_TOKEN`
5. Test protected endpoints

## 📝 Adding New Admin Users

Currently, you need to manually insert users into the database:

```sql
INSERT INTO users (email, password, name, role, is_active)
VALUES (
  'newadmin@majorworld.com',
  '$2b$10$hashed_password_here',  -- Use bcrypt to hash
  'New Admin',
  'admin',
  true
);
```

**To hash a password in Node.js:**
```typescript
import * as bcrypt from 'bcrypt';
const hashed = await bcrypt.hash('password123', 10);
```

## 🔐 Security Best Practices

1. ✅ **Change JWT_SECRET** in production
2. ✅ **Change default admin password** immediately
3. ✅ Passwords are hashed with bcrypt (10 rounds)
4. ✅ JWT tokens expire in 7 days (configurable)
5. ✅ Inactive users cannot login
6. ✅ Passwords excluded from API responses (@Exclude decorator)

## 🚨 Troubleshooting

### "User not found or inactive"
- Check if user exists in database
- Check if `is_active = true`

### "Invalid credentials"
- Verify email and password
- Password is case-sensitive

### "Unauthorized" on protected routes
- Include `Authorization: Bearer <token>` header
- Check if token is expired
- Verify JWT_SECRET matches between environments

### Migration Issues
```bash
# Check migration status
npm run migration:show

# Revert last migration
npm run migration:revert
```

## 📚 Next Steps

1. Update default admin password
2. Create additional admin users as needed
3. Configure JWT_SECRET in production
4. Consider implementing:
   - Password reset functionality
   - Email verification
   - Refresh tokens
   - Rate limiting on login
   - Role-based authorization guard
