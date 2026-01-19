# API Status Codes Reference

## Overview
This API uses **standard HTTP status codes** following NestJS conventions. All responses follow a standardized format with `success`, `message`, and `data` fields.

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Request Success",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "data": null,
  "error": "Additional error details (optional)"
}
```

## Status Codes Used in This API

### Success (2xx)

| Code | Status | When Used | Example Endpoints |
|------|--------|-----------|-------------------|
| `200` | OK | Successful GET, PUT, DELETE requests | `GET /api/admin/device-tokens` |
| `201` | Created | Successful POST (resource created) | `POST /api/admin/push-messages` |

### Client Errors (4xx)

| Code | Status | When Used | Common Scenarios |
|------|--------|-----------|------------------|
| `400` | Bad Request | Invalid request data or business logic violation | - FCM token already exists<br>- Scheduled time must be in the future<br>- Message already sent<br>- No active device tokens found |
| `401` | Unauthorized | Authentication failed or missing | - Invalid credentials<br>- Invalid/expired token<br>- Missing Bearer token |
| `403` | Forbidden | Authenticated but not authorized | - Only super admins can create admins |
| `404` | Not Found | Resource doesn't exist | - Push message not found<br>- Device token not found<br>- User not found |
| `409` | Conflict | Resource conflict | - Email already in use |
| `422` | Unprocessable Entity | Validation failed | - Invalid DTO fields<br>- Missing required fields<br>- Invalid format (e.g., invalid hex color) |

### Server Errors (5xx)

| Code | Status | When Used |
|------|--------|-----------|
| `500` | Internal Server Error | Unexpected server errors |

## Error Examples

### 400 Bad Request
```json
{
  "success": false,
  "message": "FCM token already exists",
  "data": null
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid credentials",
  "data": null
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Push message with ID 123 not found",
  "data": null
}
```

### 422 Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "error": [
    "email must be a valid email address",
    "password must be longer than or equal to 8 characters"
  ]
}
```

## Frontend Implementation Guide

### Axios/Fetch Error Handling

```typescript
try {
  const response = await api.get('/admin/device-tokens');
  if (response.data.success) {
    // Handle success
    const data = response.data.data;
  }
} catch (error) {
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data.message;
    const errorDetails = error.response.data.error;

    switch (status) {
      case 400:
        // Bad request - show validation error
        showError(message);
        break;
      case 401:
        // Unauthorized - redirect to login
        redirectToLogin();
        break;
      case 403:
        // Forbidden - show permission error
        showError('You do not have permission');
        break;
      case 404:
        // Not found - show not found message
        showError(message);
        break;
      case 422:
        // Validation error - show field errors
        showValidationErrors(errorDetails);
        break;
      case 500:
        // Server error - show generic error
        showError('Server error. Please try again later.');
        break;
      default:
        showError('An error occurred');
    }
  }
}
```

### React Query Example

```typescript
const { data, error } = useQuery({
  queryKey: ['deviceTokens'],
  queryFn: async () => {
    const res = await api.get('/admin/device-tokens');
    return res.data.data; // Extract data from standardized response
  },
  onError: (error: any) => {
    const status = error.response?.status;
    if (status === 401) {
      // Handle unauthorized
    }
  }
});
```

### TypeScript Types

```typescript
// Response types
interface ApiSuccessResponse<T = any> {
  success: true;
  message: string;
  data: T;
}

interface ApiErrorResponse {
  success: false;
  message: string;
  data: null;
  error?: string | string[] | Record<string, any>;
}

type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// Status codes enum (optional)
enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}
```

## Authentication

Most endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

Public endpoints (no auth required):
- `POST /api/auth/login`
- `POST /api/auth/refresh`

When a token expires (401), use the refresh token endpoint to get a new access token.

## Common Error Messages by Module

### Auth Module
- `401`: Invalid credentials
- `401`: Invalid refresh token
- `401`: User not found or inactive
- `401`: Token revoked
- `403`: Only super admins can create admins
- `409`: Email already in use

### Push Messages
- `400`: At least one message (Android or iOS) is required
- `400`: Scheduled time is required for scheduled messages
- `400`: Scheduled time must be in the future
- `400`: Cannot update/delete a message that has been sent
- `400`: Message has already been sent
- `400`: No active device tokens found
- `404`: Push message with ID {id} not found

### Device Tokens
- `400`: FCM token already exists
- `404`: Device token with ID {id} not found

## API Documentation

For detailed endpoint documentation, visit: `http://localhost:3001/api`
