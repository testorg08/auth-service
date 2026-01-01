# API Documentation

## Authentication Service API

The Authentication Service provides a RESTful API for user authentication and authorization within the Conga Platform.

## Base URLs

| Environment | Base URL |
|-------------|----------|
| Development | `https://auth-dev.conga.com/api/v1` |
| Staging | `https://auth-staging.conga.com/api/v1` |
| Production | `https://auth.conga.com/api/v1` |

## Authentication

All API endpoints (except login) require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### POST /auth/login

Authenticate user credentials and receive access tokens.

**Request Body:**
```json
{
  "email": "user@conga.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@conga.com",
    "name": "John Doe",
    "roles": ["user"]
  }
}
```

### POST /auth/validate

Validate an access token and return user information.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response (200 OK):**
```json
{
  "valid": true,
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@conga.com",
    "name": "John Doe",
    "roles": ["user"]
  },
  "expires_at": "2024-01-01T12:00:00Z"
}
```

### POST /auth/refresh

Refresh an access token using a refresh token.

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
```

### POST /auth/logout

Invalidate user session and tokens.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password",
    "details": {}
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `INVALID_CREDENTIALS` | Invalid email or password |
| `TOKEN_EXPIRED` | Access token has expired |
| `TOKEN_INVALID` | Access token is malformed or invalid |
| `RATE_LIMITED` | Too many requests, rate limit exceeded |
| `USER_LOCKED` | User account is locked due to failed attempts |
| `MFA_REQUIRED` | Multi-factor authentication required |

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Login endpoint**: 5 attempts per minute per IP
- **Other endpoints**: 100 requests per minute per user
- **Rate limit headers** are included in responses:
  - `X-RateLimit-Limit`: Request limit per window
  - `X-RateLimit-Remaining`: Remaining requests in window
  - `X-RateLimit-Reset`: Time when window resets

## Security Headers

All responses include security headers:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`

## SDK Examples

### JavaScript/Node.js

```javascript
const CongaAuth = require('@conga/auth-sdk');

const auth = new CongaAuth({
  baseURL: 'https://auth.conga.com/api/v1'
});

// Login
const tokens = await auth.login('user@conga.com', 'password');

// Validate token
const user = await auth.validate(tokens.access_token);

// Refresh token
const newTokens = await auth.refresh(tokens.refresh_token);
```

### Python

```python
from conga_auth import CongaAuth

auth = CongaAuth(base_url='https://auth.conga.com/api/v1')

# Login
tokens = auth.login('user@conga.com', 'password')

# Validate token
user = auth.validate(tokens['access_token'])

# Refresh token
new_tokens = auth.refresh(tokens['refresh_token'])
```

## Testing

### Health Check

```bash
curl https://auth.conga.com/health
```

### API Testing

Use the provided Postman collection or OpenAPI specification for comprehensive API testing.

## Support

For API-related questions:
- **Documentation**: [OpenAPI Specification](../api/openapi.yaml)
- **Team**: Platform Team
- **Email**: platform-team@conga.com