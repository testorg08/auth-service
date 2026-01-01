# Conga Authentication Service

[![Build Status](https://github.com/testorg08/auth-service/workflows/CI/badge.svg)](https://github.com/testorg08/auth-service/actions)
[![Coverage](https://codecov.io/gh/testorg08/auth-service/branch/main/graph/badge.svg)](https://codecov.io/gh/testorg08/auth-service)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)

Core authentication and authorization service for the Conga Platform.

## 🔐 Overview

The Authentication Service provides secure, scalable authentication and authorization capabilities for all Conga Platform services. It implements JWT-based authentication with support for multi-factor authentication, role-based access control, and comprehensive audit logging.

## 🏗️ Architecture

- **Site Group**: SSG1 (Foundation Layer)
- **Sync Wave**: 1 (First to deploy)
- **Dependencies**: None (foundation service)
- **Dependents**: All other Conga services

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Docker (for containerized deployment)

### Local Development

```bash
# Clone repository
git clone https://github.com/testorg08/auth-service.git
cd auth-service

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start database and cache
docker-compose up -d postgres redis

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://auth_user:password@localhost:5432/auth_db

# Redis
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your-super-secure-secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📚 Documentation

- **[API Documentation](docs/api.md)** - Complete API reference
- **[Deployment Guide](docs/deployment.md)** - Deployment and operations
- **[Architecture](docs/architecture.md)** - System architecture and design
- **[Security](docs/security.md)** - Security considerations and best practices

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | User authentication |
| POST | `/api/v1/auth/validate` | Token validation |
| POST | `/api/v1/auth/refresh` | Token refresh |
| POST | `/api/v1/auth/logout` | User logout |
| GET | `/health` | Health check |
| GET | `/metrics` | Prometheus metrics |

## 🌍 Environments

| Environment | URL | Status |
|-------------|-----|--------|
| **Development** | https://auth-dev.conga.com | [![Dev Status](https://img.shields.io/badge/status-healthy-green)](https://auth-dev.conga.com/health) |
| **Staging** | https://auth-staging.conga.com | [![Staging Status](https://img.shields.io/badge/status-healthy-green)](https://auth-staging.conga.com/health) |
| **Production** | https://auth.conga.com | [![Prod Status](https://img.shields.io/badge/status-healthy-green)](https://auth.conga.com/health) |

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

## 📦 Deployment

The service is deployed using GitOps with ArgoCD:

```bash
# Apply ArgoCD applications
kubectl apply -f .argocd/dev-application.yaml
kubectl apply -f .argocd/staging-application.yaml
kubectl apply -f .argocd/prod-application.yaml
```

## 📊 Monitoring

### Health Checks

- **Liveness**: `/health/live`
- **Readiness**: `/health/ready`
- **Startup**: `/health/startup`

### Metrics

Prometheus metrics available at `/metrics`:

- `auth_requests_total` - Total requests
- `auth_requests_duration_seconds` - Request duration
- `auth_active_sessions` - Active sessions
- `auth_failed_logins_total` - Failed login attempts

### Alerts

- High error rate (>10%)
- Service unavailable
- High response time (>1s)
- Failed login spike

## 🔒 Security

- JWT tokens with configurable expiration
- bcrypt password hashing with salt
- Rate limiting on all endpoints
- Comprehensive audit logging
- MFA support for admin accounts
- Network policies and pod security standards

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow ESLint configuration
- Write tests for new features
- Update documentation
- Follow semantic versioning

## 📋 Infrastructure Requirements

### Development
- **CPU**: 100m-500m
- **Memory**: 128Mi-512Mi
- **Storage**: 1Gi
- **Replicas**: 1

### Production
- **CPU**: 500m-2000m
- **Memory**: 512Mi-2Gi
- **Storage**: 10Gi
- **Replicas**: 3

## 🆘 Support

- **Team**: Platform Team
- **Email**: platform-team@conga.com
- **Slack**: #platform-team
- **Documentation**: [Backstage Service Catalog](https://backstage.conga.com/catalog/default/component/auth-service)
- **On-call**: PagerDuty escalation policy

## 📄 License

This project is proprietary software owned by Conga. All rights reserved.

---

**Part of the Conga Platform** | **Site Group SSG1** | **Sync Wave 1**