# Auth Service Deployment Guide

## Container Registry Setup

This service uses GitHub Container Registry (GHCR) for storing Docker images.

### First-time Setup

1. **Enable GitHub Container Registry** for your repository:
   - Go to your repository settings
   - Navigate to "Actions" → "General"
   - Under "Workflow permissions", ensure "Read and write permissions" is selected

2. **Make your package public** (optional, for easier access):
   - Go to https://github.com/testorg08/auth-service/pkgs/container/auth-service
   - Click "Package settings"
   - Change visibility to "Public"

## Deployment Options

### Option 1: Automatic via GitHub Actions

Push to `main` or `develop` branch to trigger automatic build and registry push:

```bash
git push origin main
```

The CI/CD pipeline will:
- Run tests
- Build Docker image
- Push to `ghcr.io/testorg08/auth-service`
- Provide deployment instructions

### Option 2: Manual Local Deployment

```bash
# Deploy latest version
./scripts/deploy-local.sh

# Deploy specific version
./scripts/deploy-local.sh main-abc1234
```

### Option 3: Direct kubectl

```bash
# Apply manifests directly
kubectl apply -k k8s/overlays/dev
```

## Accessing the Service

### With minikube:
```bash
minikube service auth-service -n ssg1-dev --url
```

### With other clusters:
```bash
kubectl port-forward -n ssg1-dev svc/auth-service 3000:80
```

Then visit: http://localhost:3000